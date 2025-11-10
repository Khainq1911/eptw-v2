import { Module } from '@nestjs/common';
import { PermitController } from './permit.controller';
import { PermitService } from './permit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitEntity } from '@/database/entities/permit.entity';
import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { DeviceEntity } from '@/database/entities';
import { MailService } from '../mailer/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermitEntity, WorkActivityEntity, DeviceEntity])],
  controllers: [PermitController],
  providers: [PermitService, MailService],
})
export class PermitModule {}
