import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PermitModule } from '../permit/permit.module';
import { DeviceModule } from '../device/device.module';
import { TemplateModule } from '../template/template.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [PermitModule, DeviceModule, TemplateModule],
})
export class DashboardModule {}
