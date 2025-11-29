import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mailer/mail.module';
import 'dotenv/config';
import { DeviceModule } from './modules/device/device.module';
import { ExcelModule } from './modules/excel/excel.module';
import { TemplateModule } from './modules/template/template.module';
import { ApprovalTypeModule } from './modules/approval-type/approval-type.module';
import { TemplateTypeService } from './modules/template-type/template-type.service';
import { RoleModule } from './modules/role/role.module';
import { TemplateTypeModule } from './modules/template-type/template-type.module';
import { WorkActivityEntity } from './database/entities/work-activity.entity';
import { WorkActivityModule } from './modules/work-activity/work-activity.module';
import { PermitModule } from './modules/permit/permit.module';
import { UserModule } from './modules/user/user.module';
import { S3Module } from './modules/s3-client/s3-client.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    DatabaseModule,
    MailModule,
    DeviceModule,
    ExcelModule,
    TemplateModule,
    ApprovalTypeModule,
    TemplateTypeModule,
    RoleModule,
    WorkActivityModule,
    PermitModule,
    UserModule,
    S3Module,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
