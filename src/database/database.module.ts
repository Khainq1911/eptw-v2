import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ApprovalTypeEntity,
  DeviceEntity,
  RoleEntity,
  TemplateEntity,
  UserEntity,
} from './entities';
import { TemplateTypeEntity } from './entities/template-type.entity';
import { PermitEntity } from './entities/permit.entity';
import { PermitFileEntity } from './entities/permit-file.entity';
import { PermitApprovalEntity } from './entities/permit-approval.entity';
import { WorkActivityEntity } from './entities/work-activity.entity';
import { PermitSignEntity } from './entities/permit-sign.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [
          UserEntity,
          RoleEntity,
          DeviceEntity,
          TemplateEntity,
          ApprovalTypeEntity,
          TemplateTypeEntity,
          PermitEntity,
          PermitFileEntity,
          PermitApprovalEntity,
          WorkActivityEntity,
          PermitSignEntity,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
