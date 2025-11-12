import { PermitEntity } from '@/database/entities/permit.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { permitDto } from './permit.dto';
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
    const { workActivityIds, deviceIds, ...data } = payload;

    return await this.dataSource.transaction(async (manager) => {
      const workActivities = await manager.find(WorkActivityEntity, {
        where: { id: In(workActivityIds) },
      });
      const devices = await manager.find(DeviceEntity, {
        where: { id: In(deviceIds) },
      });

      const permit = manager.create(PermitEntity, {
        ...data,
        workActivities,
        devices,
        createdBy: user,
        updatedBy: user,
      });

      await manager.save(PermitEntity, permit);

      const requiredSigners = this.getRequiredSignerInfor(payload.sections);

      for (const signer of requiredSigners) {
        const signUser = await manager.findOne(UserEntity, {
          where: { id: signer.signId },
        });

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
