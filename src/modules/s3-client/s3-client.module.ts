import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ClientService } from './s3-client.service';
import { S3Controller } from './s3-client.controller';

@Module({
  imports: [ConfigModule],
  providers: [S3ClientService],
  exports: [S3ClientService],
  controllers: [S3Controller],
})
export class S3Module {}
