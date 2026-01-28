import { Module } from '@nestjs/common';
import { PermitController } from './permit.controller';
import { PermitService } from './permit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitEntity } from '@/database/entities/permit.entity';
import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { DeviceEntity, TemplateEntity } from '@/database/entities';
import { MailService } from '../mailer/mail.service';
import { TemplateService } from '../template/template.service';
import { RedisModule } from '../redis/redis.module';
import { RoleModule } from '../role/role.module';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermitEntity,
      WorkActivityEntity,
      DeviceEntity,
      TemplateEntity,
    ]),
    RedisModule,
    RoleModule,
    ExcelModule
  ],
  controllers: [PermitController],
  providers: [PermitService, MailService, TemplateService],
  exports: [PermitService],
})
export class PermitModule {}
