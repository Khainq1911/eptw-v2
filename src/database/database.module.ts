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
import { WorkActivityEntity } from './entities/work-activity.entity';
import { PermitSignEntity } from './entities/permit-sign.entity';
import { PermitLogEntity } from './entities/permit-log.entity';
import { MenuEntity } from './entities/menu.entity';

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
          WorkActivityEntity,
          PermitSignEntity,
          PermitLogEntity,
          MenuEntity,
        ],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
