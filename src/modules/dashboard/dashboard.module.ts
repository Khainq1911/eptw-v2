import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PermitModule } from '../permit/permit.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [PermitModule],
})
export class DashboardModule {}
