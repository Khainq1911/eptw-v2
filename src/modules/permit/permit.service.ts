import { PermitEntity } from '@/database/entities/permit.entity';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, DataSource, In, Repository } from 'typeorm';
import { filterDto, permitDto, permitListForTableDto } from './permit.dto';
import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { DeviceEntity, UserEntity } from '@/database/entities';
import { MailService } from '../mailer/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PermitFileEntity } from '@/database/entities/permit-file.entity';
import { PermitSignEntity } from '@/database/entities/permit-sign.entity';
import { PERMIT_STATUS } from '@/common/constants';
import { TemplateService } from '../template/template.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PermitService {
  constructor(
    @InjectRepository(PermitEntity)
    private readonly permitRepository: Repository<PermitEntity>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
    private readonly templateService: TemplateService,
    private readonly redisService: RedisService,
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
      relations: [
        'workActivities',
        'devices',
        'createdBy',
        'template',
        'attachments',
      ],
    });

    if (!permit) {
      throw new NotFoundException(`Permit with id ${id} not found`);
    }

    const signs = await this.dataSource.getRepository(PermitSignEntity).find({
      where: { permit: { id } },
      relations: ['signer'],
    });

    const template = await this.templateService.findOne(permit.template.id);

    return {
      ...permit,
      template,
      signs,
    };
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

    query.andWhere(
      new Brackets((qb) => {
        qb.where('permit.created_id = :id', { id: user.id }).orWhere(
          `permit.id IN (
              SELECT ps.permit_id
              FROM permit_sign ps
              WHERE ps.signer_id = :signerId
          )`,
          { signerId: user.id },
        );
      }),
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
    if (filter.startTime) {
      query.andWhere('permit.startTime >= :startTime', {
        startTime: filter.startTime,
      });
    }
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

  public async deletePermit(
    id: number,
    user: UserEntity,
  ): Promise<{ message: string }> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Load permit
      const permit = await manager.findOne(PermitEntity, {
        where: { id },
        relations: ['workActivities', 'devices'],
      });

      if (!permit) {
        throw new NotFoundException(`Permit with id ${id} not found`);
      }

      if (permit.status !== PERMIT_STATUS.PENDING) {
        throw new BadRequestException(`Permit with id ${id} is not pending`);
      }

      // 2. Handle devices
      const deviceIds = permit.devices?.map((d) => d.id) || [];

      if (deviceIds.length) {
        const devices = await manager.find(DeviceEntity, {
          where: { id: In(deviceIds) },
        });

        const updatedDevices = devices.map((d) =>
          manager.create(DeviceEntity, {
            ...d,
            isUsed: false,
            updatedBy: user.id,
          }),
        );

        await manager.save(DeviceEntity, updatedDevices);
      }

      permit.status = PERMIT_STATUS.CANCELLED;
      permit.updatedBy = user;
      await manager.save(permit);

      return { message: 'Permit deleted successfully' };
    });
  }

  public async sendOtp(user: any): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await this.redisService.set(user.id.toString(), otp, 300000);

    await this.mailService.sendMail({
      email: user.email,
      subject: 'Mã OTP Xác Minh Ký Tài Liệu',
      template: 'otp-verify',
      context: {
        name: user.name,
        otp: otp,
      },
    });
  }

  public async signSection(payload: any, user: any) {
    return await this.dataSource.transaction(async (manager) => {
      const sign = await manager.findOne(PermitSignEntity, {
        where: {
          permit: { id: payload.permitId },
          sectionId: payload.sectionId,
          signer: { id: user.id },
        },
      });

      if (!sign) {
        throw new NotFoundException('Phần ký không tồn tại');
      }

      if (sign.signedAt !== null) {
        throw new BadRequestException('Bạn đã ký tài liệu này rồi');
      }

      const isOtpValid = await this.verifyOtp(payload.otp, user);
      if (!isOtpValid) {
        throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
      }

      const newSign = await manager.save(PermitSignEntity, {
        ...sign,
        status: 'Signed',
        signedAt: new Date(),
        updatedAt: new Date(),
        signUrl: payload.signUrl,
      });

      await this.mailService.sendMail({
        email: user.email,
        subject: 'Ký tài liệu thành công',
        template: 'sign-success',
        context: {
          time: new Date().toLocaleString(),
          documentUrl: `http://localhost:5173/permit/view/${payload.permitId}`,
        },
      });

      return newSign;
    });
  }

  private async verifyOtp(otp: number, user: any): Promise<boolean> {
    const storedOtp = await this.redisService.get(user.id.toString());
    if (!storedOtp) return false;

    const isValid = otp === Number(storedOtp);
    if (isValid) {
      await this.redisService.del(user.id.toString());
    }
    return isValid;
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
