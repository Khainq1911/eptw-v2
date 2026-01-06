import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from '@/database/entities';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]), ExcelModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
