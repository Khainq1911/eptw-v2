import { PermitEntity } from '@/database/entities/permit.entity';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { filterDto, permitDto, permitListForTableDto } from './permit.dto';
import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { DeviceEntity, UserEntity } from '@/database/entities';
import { MailService } from '../mailer/mail.service';
import { Exception } from 'handlebars';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermitService {
  constructor(
    @InjectRepository(PermitEntity)
    private readonly permitRepository: Repository<PermitEntity>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async create(payload: permitDto, user: any) {
    const { workActivityIds, deviceIds, templateId, ...data } = payload;

    return await this.dataSource.transaction(async (manager) => {
      const workActivities = await manager.find(WorkActivityEntity, {
        where: { id: In(workActivityIds) },
      });

      // device handle
      const devices = await manager.find(DeviceEntity, {
        where: { id: In(deviceIds) },
      });

      const usedDevices = devices.filter((d) => d.isUsed);

      if (usedDevices.length > 0) {
        throw new HttpException('Có thiết bị đã được sử dụng', 400);
      }

      const updateDevices = devices.map((d) => ({
        ...d,
        isUsed: true,
        updatedBy: user,
      }));

      await manager.save(DeviceEntity, updateDevices);
      // end device handle

      const permit = manager.create(PermitEntity, {
        ...data,
        workActivities,
        template: { id: templateId },
        devices,
        createdBy: user,
        updatedBy: user,
      });

      await manager.save(PermitEntity, permit);

      const requiredSigners = this.getRequiredSignerInfor(payload.sections);

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

        await this.mailService.sendMail({
          email: signUser.email,
          subject: 'Sign Permit Request',
          template: 'sign-permit',
          context: {
            creatorName: user.name,
            createdTime: new Date().toLocaleString(),
            signerName: signUser.name,
            permitName: permit.name,
            permitLink: `https://yourapp.com/permits/${permit.id}`,
          },
        });
      }

      return { message: 'Permit created successfully', permit };
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

  async getListPermit(filter: filterDto): Promise<permitListForTableDto[]> {
    const permits = await this.permitRepository.find({
      relations: ['workActivities', 'devices', 'createdBy', 'template'],
    });

    const query = this.dataSource
      .getRepository(PermitEntity)
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.workActivities', 'workActivity')
      .leftJoinAndSelect('permit.devices', 'device')
      .leftJoinAndSelect('permit.createdBy', 'createdBy')
      .leftJoinAndSelect('permit.template', 'template')
      .offset((filter.page - 1) * filter.limit)
      .limit(filter.limit);

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
      query.andWhere('device.id = :devices', { devices: filter.devices });
    if (filter.workActivities)
      query.andWhere('workActivity.id = :workActivities', {
        workActivities: filter.workActivities,
      });
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
    }));
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
