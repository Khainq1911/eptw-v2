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
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
