import { PermitEntity } from '@/database/entities/permit.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Brackets,
  DataSource,
  EntityManager,
  In,
  LessThan,
  Not,
  Repository,
} from 'typeorm';
import { filterDto, permitDto, permitListForTableDto } from './permit.dto';
import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { DeviceEntity, UserEntity } from '@/database/entities';
import { MailService } from '../mailer/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PermitFileEntity } from '@/database/entities/permit-file.entity';
import { PermitSignEntity } from '@/database/entities/permit-sign.entity';
import { APPROVAL_TYPE, PERMIT_STATUS } from '@/common/constants';
import { TemplateService } from '../template/template.service';
import { RedisService } from '../redis/redis.service';
import { RoleService } from '../role/role.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PermitService {
  constructor(
    @InjectRepository(PermitEntity)
    private readonly permitRepository: Repository<PermitEntity>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
    private readonly templateService: TemplateService,
    private readonly redisService: RedisService,
    private readonly roleService: RoleService,
  ) {}

  async create(payload: permitDto, user: any) {
    const { workActivityIds, deviceIds, templateId, attachments, ...data } =
      payload;

    return await this.dataSource.transaction(async (manager) => {
      // 1. Load work activities
      const workActivities = await manager.find(WorkActivityEntity, {
        where: { id: In(workActivityIds) },
      });

      let devices = await this.updateDeviceStatus(deviceIds, user, manager);

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
        const permitSignEntities = requiredSigners.map((section) =>
          manager.create(PermitSignEntity, {
            permit: permitEntity,
            sectionId: section.id,
            signer: { id: section.signId },
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

  async getDetailPermit(id: number, action: string, user: any): Promise<any> {
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

    if (action === 'update') {
      const adminRole = await this.roleService.getAdminRoleId();

      const isAdmin = user.roleId === adminRole?.id;
      const isCreator = permit?.createdBy?.id === user.id;

      if (!isAdmin && !isCreator) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa giấy phép');
      }
    }

    if (!permit) {
      throw new NotFoundException(`Permit with id ${id} not found`);
    }

    const signs = await this.dataSource.getRepository(PermitSignEntity).find({
      where: { permit: { id } },
      order: { sectionId: 'ASC' },
      relations: ['signer'],
    });

    const template = await this.templateService.findOne(permit.template.id);

    const approvalTypeCode = template?.approvalType?.code;

    let signList: any;
    if (approvalTypeCode === APPROVAL_TYPE.SEQUENCE) {
      let index = signs.findIndex((s) => s.status === 'signed');
      index = index === -1 ? 0 : index;

      signList = signs.map((item, idx) => {
        if (idx > index) {
          return { ...item, isSignable: false };
        }
        return { ...item, isSignable: true };
      });
    } else {
      signList = signs.map((item) => {
        return { ...item, isSignable: true };
      });
    }

    return {
      ...permit,
      template,
      signs: signList,
    };
  }

  async getListPermit(
    filter: filterDto,
    user: any,
  ): Promise<permitListForTableDto[]> {
    const adminRole = await this.roleService.getAdminRoleId();

    // ----------------------------
    // STEP 1: Query danh sách permit.id
    // ----------------------------
    let idQuery = this.dataSource
      .createQueryBuilder()
      .select('permit.id', 'id')
      .from(PermitEntity, 'permit')
      .leftJoin('permit.template', 'template')
      .leftJoin('permit.createdBy', 'createdBy');

    // 🔥 Phân quyền
    if (user.roleId !== adminRole?.id) {
      idQuery.andWhere(
        new Brackets((qb) => {
          qb.where('permit.created_id = :id', { id: user.id }).orWhere(
            `
            permit.id IN (
              SELECT ps.permit_id
              FROM permit_sign ps
              WHERE ps.signer_id = :signerId
            )
          `,
            { signerId: user.id },
          );
        }),
      );
    }

    // 🔍 Filter
    if (filter.name)
      idQuery.andWhere('permit.name ILIKE :name', { name: `%${filter.name}%` });

    if (filter.templateId)
      idQuery.andWhere('template.id = :templateId', {
        templateId: filter.templateId,
      });

    if (filter.status)
      idQuery.andWhere('permit.status = :status', { status: filter.status });

    if (filter.createdBy)
      idQuery.andWhere('createdBy.id = :createdBy', {
        createdBy: filter.createdBy,
      });

    if (filter.startTime)
      idQuery.andWhere('permit.startTime >= :startTime', {
        startTime: filter.startTime,
      });

    if (filter.endTime)
      idQuery.andWhere('permit.endTime <= :endTime', {
        endTime: filter.endTime,
      });

    if (filter.devices) {
      idQuery.andWhere(
        `
      EXISTS (
        SELECT 1 FROM permit_device pd
        WHERE pd.permit_id = permit.id
          AND pd.device_id = :deviceId
      )`,
        { deviceId: filter.devices },
      );
    }

    if (filter.workActivities) {
      idQuery.andWhere(
        `
      EXISTS (
        SELECT 1 FROM permit_work_activity pwa
        WHERE pwa.permit_id = permit.id
          AND pwa.work_activity_id = :workActivityId
      )`,
        { workActivityId: filter.workActivities },
      );
    }

    // 🔥 Pagination CHUẨN
    idQuery
      .orderBy('permit.createdAt', 'DESC')
      .offset((filter.page - 1) * filter.limit)
      .limit(filter.limit);

    const rawIds = await idQuery.getRawMany();
    const ids = rawIds.map((i) => i.id);

    if (ids.length === 0) return [];

    // ----------------------------
    // STEP 2: Query đầy đủ bằng danh sách id
    // ----------------------------
    const query = this.dataSource
      .getRepository(PermitEntity)
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.workActivities', 'workActivities')
      .leftJoinAndSelect('permit.devices', 'devices')
      .leftJoinAndSelect('permit.createdBy', 'createdBy')
      .leftJoinAndSelect('permit.template', 'template')
      .where('permit.id IN (:...ids)', { ids })
      .orderBy('permit.createdAt', 'DESC');

    const listPermits = await query.getMany();

    // ----------------------------
    // Format kết quả
    // ----------------------------
    return listPermits.map((permit) => {
      const canEdit =
        user.roleId === adminRole?.id ||
        (permit.endTime >= new Date() && user.id === permit.createdBy.id);

      const canDelete =
        (user.roleId === adminRole?.id &&
          permit.status !== PERMIT_STATUS.CANCELLED) ||
        (user.id === permit.createdBy.id &&
          permit.status === PERMIT_STATUS.PENDING);

      return {
        id: permit.id,
        name: permit.name,
        templateName: permit.template.name,
        devices: permit.devices.map((d) => d.name).join(', '),
        workActivities: permit.workActivities.map((w) => w.name).join(', '),
        startTime: permit.startTime,
        endTime: permit.endTime,
        status: permit.status,
        createdAt: permit.createdAt,
        createdBy: permit.createdBy.name,
        canEdit,
        canDelete,
      };
    });
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

      const pendingSigns = await manager.count(PermitSignEntity, {
        where: {
          permit: { id: payload.permitId },
          sectionId: Not(payload.sectionId),
          status: 'Pending',
        },
      });

      if (pendingSigns === 0) {
        const permit = await manager.findOne(PermitEntity, {
          where: { id: payload.permitId },
        });

        if (!permit) {
          throw new NotFoundException('Permit không tồn tại');
        }

        permit.status = PERMIT_STATUS.APPROVED;
        await manager.save(permit);
      }

      return {
        sign: newSign,
        permitStatus:
          pendingSigns === 0 ? PERMIT_STATUS.APPROVED : PERMIT_STATUS.PENDING,
      };
    });
  }

  public async updatePermit(payload: any, user: any): Promise<any> {
    return await this.dataSource.transaction(async (manager) => {
      const { attachments: attachmentsPayload, ...rest } = payload;
      const permit = await manager.findOne(PermitEntity, {
        where: { id: payload.id },
        relations: ['devices', 'workActivities'],
      });

      if (!permit) {
        throw new NotFoundException('Permit not found');
      }

      const deviceIds = permit.devices.map((d: any) => d.id);

      if (deviceIds && deviceIds.length > 0) {
        const deviceList = await manager.find(DeviceEntity, {
          where: { id: In(deviceIds) },
        });

        const usedDevices = deviceList.map((d) => ({
          ...d,
          isUsed: false,
          updatedBy: user,
        }));

        await manager.save(DeviceEntity, usedDevices);
      }

      const workActivities = await manager.find(WorkActivityEntity, {
        where: { id: In(payload.workActivityIds) },
      });

      const updatedDevices = await this.updateDeviceStatus(
        payload.deviceIds,
        user,
        manager,
      );

      const newPermit = await manager.save(PermitEntity, {
        ...permit,
        ...rest,
        workActivities,
        devices: updatedDevices,
        updatedBy: user,
      });

      const attachments = attachmentsPayload || [];

      const existingFiles = await manager.find(PermitFileEntity, {
        where: { permit: { id: payload.id } },
      });

      const keepIds = attachments.filter((a) => a.id).map((a) => a.id);
      const removedFiles = existingFiles.filter((f) => !keepIds.includes(f.id));

      if (removedFiles.length > 0) {
        const removedIds = removedFiles.map((f) => f.id);
        await manager.delete(PermitFileEntity, removedIds);
      }

      const newAttachments = attachments.filter((a) => !a.id);
      const attachmentEntities = newAttachments.map((att) =>
        manager.create(PermitFileEntity, {
          name: att.originalname,
          type: att.mimetype,
          size: att.size,
          bucket: att.bucket || 'attachment-file',
          objectKey: att.key,
          url: att.url,
          permit: newPermit,
        }),
      );

      const newAttachmentsEntity = await manager.save(
        PermitFileEntity,
        attachmentEntities,
      );

      return {
        attachments: newAttachmentsEntity,
      };
    });
  }

  public async getDashboardStats(user: any): Promise<any> {
    const totalPermits = await this.permitRepository.count();

    const permit = await this.permitRepository
      .createQueryBuilder('p')
      .select('p.template_id', 'template_id')
      .addSelect('t.name', 'name')
      .addSelect('COUNT(*)', 'total_permits')
      .innerJoin('p.template', 't')
      .groupBy('p.template_id')
      .addGroupBy('t.name')
      .getRawMany();

    return { permit, totalPermits };
  }

  public async rejectSection(payload: any) {
    return await this.dataSource.transaction(async (manager) => {
      const permitSign = await manager.findOne(PermitSignEntity, {
        where: [{ permitId: payload.permitId, sectionId: payload.sectionId }],
        relations: ['permit', 'signer'],
      });

      if (!permitSign) {
        throw new NotFoundException('Phần ký không tồn tại');
      }

      const newSign = await manager.save(PermitSignEntity, {
        ...permitSign,
        status: 'Rejected',
        reason: payload.reason,
        updatedAt: new Date(),
      });

      await manager
        .createQueryBuilder()
        .update(PermitEntity)
        .set({
          status: PERMIT_STATUS.REJECTED,
        })
        .where({ id: payload.permitId })
        .execute();

      const permit = await this.permitRepository.findOne({
        where: { id: payload.permitId },
        relations: ['createdBy'],
      });

      const sectionName = permit?.sections.find(
        (s) => s.id === payload.sectionId,
      )?.name;

      const receiver = permit?.createdBy;

      if (permit && receiver && sectionName) {
        await this.mailService.sendMail({
          email: receiver?.email,
          subject: `Section bị từ chối - Permit #${permit.id}`,
          template: 'reject-section',
          context: {
            receiverName: receiver.email,
            permitCode: permit.id,
            sectionName: sectionName,
            signerName: permitSign.signer.name,
            reason: payload.reason,
            permitStatus: PERMIT_STATUS.REJECTED,
          },
        });
      }

      return { permitStatus: PERMIT_STATUS.REJECTED, sign: newSign };
    });
  }

  public async updatePermitStatus(payload: any, user: any) {
    const permit = await this.permitRepository.findOne({
      where: { id: payload.permitId },
      relations: ['createdBy'],
    });

    if (!permit) {
      throw new NotFoundException('Permit not found');
    }

    const adminRole = await this.roleService.getAdminRoleId();

    if (user.id !== permit?.createdBy.id || user.roleId !== adminRole?.id) {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }

    const newPermit = await this.permitRepository.save({
      ...permit,
      status: payload.status,
      updatedBy: user,
    });

    await this.mailService.sendMail({
      email: permit.createdBy?.email,
      subject: `Section bị từ chối - Permit #${permit.id}`,
      template: 'reject-permit',
      context: {
        receiverName: permit.createdBy?.name,
        permitCode: permit.id,
        updatedBy: user.name,
        newStatus: payload.status,
      },
    });

    return newPermit;
  }

  public async rejectPermit(payload: any, user: any) {
    const permit = await this.permitRepository.findOne({
      where: { id: payload.permitId },
      relations: ['createdBy'],
    });

    if (!permit) {
      throw new NotFoundException('Permit not found');
    }

    const signers = await this.dataSource.getRepository(PermitSignEntity).find({
      where: { permit: { id: payload.permitId } },
      relations: ['signer'],
    });

    const signerIds = signers.map((s) => s.signer.id);

    const adminRole = await this.roleService.getAdminRoleId();

    if (
      user.id !== permit?.createdBy.id ||
      user.roleId !== adminRole?.id ||
      (signerIds.length > 0 && !signerIds.includes(user.id))
    ) {
      throw new BadRequestException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }

    const newPermit = await this.permitRepository.save({
      ...permit,
      status: PERMIT_STATUS.REJECTED,
      updatedBy: user,
    });

    await this.returnDevices(payload.permitId);

    await this.mailService.sendMail({
      email: permit.createdBy?.email,
      subject: `Section bị từ chối - Permit #${permit.id}`,
      template: 'reject-permit',
      context: {
        receiverName: permit.createdBy?.name,
        permitCode: permit.id,
        rejectedBy: user.name,
        permitStatus: PERMIT_STATUS.REJECTED,
      },
    });

    return newPermit;
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

  private async returnDevices(permitId: number) {
    const permit = await this.permitRepository.findOne({
      where: { id: permitId },
      relations: ['devices'],
    });

    if (!permit) throw new NotFoundException('Permit not found');

    const deviceIds = permit.devices.map((d) => d.id);

    const devices = await this.dataSource.getRepository(DeviceEntity).find({
      where: { id: In(deviceIds) },
    });

    if (!devices) throw new NotFoundException('Devices not found');

    if (devices.length === 0) return [];

    const updatedDevices = devices.map((d) => ({
      ...d,
      isUsed: false,
    }));

    await this.dataSource.getRepository(DeviceEntity).save(updatedDevices);

    return devices;
  }

  private async updateDeviceStatus(
    deviceIds: number[],
    user: any,
    manager: EntityManager,
  ) {
    if (!deviceIds || deviceIds.length === 0) return;

    const listDevices = await manager.find(DeviceEntity, {
      where: { id: In(deviceIds) },
    });

    const isUsedValidate = listDevices.some((d) => d.isUsed);

    if (isUsedValidate) {
      throw new BadRequestException('Có thiết bị đã được sử dụng');
    }

    const updatedDevices = listDevices.map((d) => ({
      ...d,
      isUsed: true,
      updatedBy: user,
    }));

    await manager.save(DeviceEntity, updatedDevices);

    return updatedDevices;
  }

  @Cron('0 0 0 * * *')
  async handleCronExpirePermit() {
    const now = new Date();

    return await this.dataSource.transaction(async (manager) => {
      const expiredPermits = await manager.find(PermitEntity, {
        select: ['id'],
        where: {
          endTime: LessThan(now),
          status: Not(
            In([
              PERMIT_STATUS.CLOSED,
              PERMIT_STATUS.EXPIRED,
              PERMIT_STATUS.CANCELLED,
              PERMIT_STATUS.REJECTED,
            ]),
          ),
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!expiredPermits.length) {
        console.log('No expired permits found');
        return;
      }

      const permitIds = expiredPermits.map((p) => p.id);
      console.log('permitIds', permitIds);

      await manager.update(
        PermitEntity,
        { id: In(permitIds) },
        { status: PERMIT_STATUS.EXPIRED },
      );

      await manager
        .createQueryBuilder()
        .update(DeviceEntity)
        .set({ isUsed: false })
        .where(
          `
        id IN (
          SELECT device_id
          FROM permit_device
          WHERE permit_id IN (:...permitIds)
        )
      `,
          { permitIds },
        )
        .execute();
      console.log('Cron expire permit executed successfully');
    });
  }
}
