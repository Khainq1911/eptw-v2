import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelModule } from '../excel/excel.module';
import { DeviceEntity } from '@/database/entities/device.entity';
import { DeviceNotificationModule } from '../device-notification/device-notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]), ExcelModule, DeviceNotificationModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule { }
