import { PermitEntity } from '@/database/entities/permit.entity';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { filterDto, permitDto, permitListForTableDto } from './permit.dto';
import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { DeviceEntity, UserEntity } from '@/database/entities';
import { MailService } from '../mailer/mail.service';
import { Exception } from 'handlebars';
import { InjectRepository } from '@nestjs/typeorm';
import { PermitFileEntity } from '@/database/entities/permit-file.entity';
import { PermitSignEntity } from '@/database/entities/permit-sign.entity';
import { PERMIT_STATUS } from '@/common/constants';

@Injectable()
export class PermitService {
  constructor(
    @InjectRepository(PermitEntity)
    private readonly permitRepository: Repository<PermitEntity>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async create(payload: permitDto, user: any) {
    const { workActivityIds, deviceIds, templateId, attachments, ...data } =
      payload;

    return await this.dataSource.transaction(async (manager) => {
      // 1. Load work activities
      const workActivities = await manager.find(WorkActivityEntity, {
        where: { id: In(workActivityIds) },
      });

      let devices: DeviceEntity[] = [];
      if (deviceIds?.length) {
        // 2. Load devices
        devices = await manager.find(DeviceEntity, {
          where: { id: In(deviceIds) },
        });

        const usedDevices = devices.filter((d) => d.isUsed);
        if (usedDevices.length > 0) {
          throw new HttpException('Có thiết bị đã được sử dụng', 400);
        }

        // 3. Update devices as used
        const deviceEntities = devices.map((d) =>
          manager.create(DeviceEntity, { ...d, isUsed: true, updatedBy: user }),
        );
        await manager.save(DeviceEntity, deviceEntities);
      }

      // 4. Create permit
      const permitEntity = manager.create(PermitEntity, {
        ...data,
        name: data.name || 'Default Permit Name',
        workActivities,
        template: { id: templateId },
        devices,
        createdBy: user,
        updatedBy: user,
      });
      await manager.save(PermitEntity, permitEntity);

      // 5. Save attachments
      if (attachments?.length) {
        const attachmentEntities = attachments.map((att) =>
          manager.create(PermitFileEntity, {
            name: att.originalname,
            type: att.mimetype,
            size: att.size,
            bucket: att.bucket || 'attachment-file',
            objectKey: att.key,
            url: att.url,
            permit: permitEntity,
          }),
        );
        await manager.save(PermitFileEntity, attachmentEntities);
      }

      // 6. Save permit_sign
      const requiredSigners = this.getRequiredSignerInfor(payload.sections);
      if (requiredSigners.length) {
        const permitSignEntities = requiredSigners.map((signer) =>
          manager.create(PermitSignEntity, {
            permit: permitEntity,
            section_id: signer.id,
            signer: { id: signer.signId },
            status: 'Pending',
          }),
        );
        await manager.save(PermitSignEntity, permitSignEntities);

        // 7. Send emails to signers
        const signerIds = requiredSigners.map((s) => s.signId);
        const signUsers = await manager.find(UserEntity, {
          where: { id: In(signerIds) },
        });
        const signUserMap = new Map(signUsers.map((u) => [u.id, u]));

        for (const signer of requiredSigners) {
          const signUser = signUserMap.get(signer.signId);
          if (!signUser) {
            throw new NotFoundException(
              `User with id ${signer.signId} not found`,
            );
          }

          /* await this.mailService.sendMail({
            email: signUser.email,
            subject: 'Sign Permit Request',
            template: 'sign-permit',
            context: {
              creatorName: user.name,
              createdTime: new Date().toLocaleString(),
              signerName: signUser.name,
              permitName: permitEntity.name,
              permitLink: `https://yourapp.com/permits/${permitEntity.id}`,
            },
          }); */
        }
      }

      return { message: 'Permit created successfully', permit: permitEntity };
    });
  }

  async getDetailPermit(id: number) {
    const permit = await this.permitRepository.findOne({
      where: { id },
      relations: ['workActivities', 'devices', 'createdBy', 'template'],
    });

    if (!permit) {
      throw new NotFoundException(`Permit with id ${id} not found`);
    }

    return permit;
  }

  async getListPermit(
    filter: filterDto,
    user: any,
  ): Promise<permitListForTableDto[]> {
    const query = this.dataSource
      .getRepository(PermitEntity)
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.workActivities', 'allWorkActivities')
      .leftJoinAndSelect('permit.devices', 'devices')
      .leftJoinAndSelect('permit.createdBy', 'createdBy')
      .leftJoinAndSelect('permit.template', 'template')
      .offset((filter.page - 1) * filter.limit)
      .limit(filter.limit);

    query.andWhere('permit.created_id = :id', { id: user.id });
    query.orWhere(
      `permit.id in (SELECT ps.permit_id
      FROM permit_sign ps
      WHERE ps.signer_id = :signerId)`,
      { signerId: user.id },
    );

    if (filter.name)
      query.andWhere('permit.name ilike :name', { name: `%${filter.name}%` });
    if (filter.templateId)
      query.andWhere('template.id = :templateId', {
        templateId: filter.templateId,
      });
    if (filter.status)
      query.andWhere('permit.status = :status', { status: filter.status });
    if (filter.createdBy)
      query.andWhere('createdBy.id = :createdBy', {
        createdBy: filter.createdBy,
      });
    if (filter.devices)
      query.andWhere(
        `
        EXISTS (
          SELECT 1
          FROM permit_device pd
          WHERE pd.permit_id = permit.id
            AND pd.device_id = :deviceId
        )
      `,
        { deviceId: filter.devices },
      );
    if (filter.workActivities)
      query.andWhere(
        `
        EXISTS (
          SELECT 1
          FROM permit_work_activity pwa
          WHERE pwa.permit_id = permit.id
            AND pwa.work_activity_id = :workActivityId
        )
      `,
        { workActivityId: filter.workActivities },
      );
    if (filter.startTime)
      query.andWhere('permit.startTime >= :startTime', {
        startTime: filter.startTime,
      });
    if (filter.endTime)
      query.andWhere('permit.endTime <= :endTime', {
        endTime: filter.endTime,
      });

    const listPermits = await query.getMany();

    return listPermits.map((permit) => ({
      id: permit.id,
      name: permit.name,
      templateName: permit.template.name,
      devices: permit.devices.map((device) => device.name).join(', '),
      workActivities: permit.workActivities
        .map((workActivity) => workActivity.name)
        .join(', '),
      startTime: permit.startTime,
      endTime: permit.endTime,
      status: permit.status,
      createdAt: permit.createdAt,
      createdBy: permit.createdBy.name,
    }));
  }

  public async deletePermit(id: number): Promise<{ message: string }> {
    return await this.dataSource.transaction(async (manager) => {
      const permit = await manager.findOne(PermitEntity, {
        where: { id },
      });

      if (!permit)
        throw new NotFoundException(`Permit with id ${id} not found`);

      if (permit.status !== PERMIT_STATUS.PENDING)
        throw new BadRequestException(`Permit with id ${id} is not pending`);

      permit.status = PERMIT_STATUS.CANCELLED;
      await manager.save(permit);

      return { message: 'Permit deleted successfully' };
    });
  }

  private getRequiredSignerInfor(sections: any) {
    return sections
      .filter((section: any) => section.sign.required)
      .map((section: any) => ({
        id: section.id,
        name: section.name,
        signId: section.sign.signId,
      }));
  }
}
