import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermitService } from '../permit/permit.service';
import { DeviceService } from '../device/device.service';
import { TemplateService } from '../template/template.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly permitService: PermitService,
    private readonly deviceService: DeviceService,
    private readonly templateService: TemplateService,
  ) {}

  @Post('/permit-template')
  public async getDashboardStats(@Body() filter: any): Promise<any> {
    return await this.permitService.getDashboardStats(filter);
  }

  @Post('/permit-status')
  public async getPermitStatusStats(@Body() filter: any): Promise<any> {
    return await this.permitService.getStatusPermitStats(filter);
  }

  @Post('/permit-role')
  public async getPermitRoleStats(@Body() filter: any): Promise<any> {
    return await this.permitService.getRolePermitStats(filter);
  }

  @Get('/device-status')
  public async getDeviceStatusStats(): Promise<any> {
    return await this.deviceService.deviceStatusStats();
  }

  @Get('/device-used')
  public async getDeviceUsedStats(): Promise<any> {
    return await this.deviceService.getUsedStats();
  }

  @Get('/template-approval-type')
  public async getTemplateApprovalTypeStats(): Promise<any> {
    return await this.templateService.getTemplateApprovalTypeStats();
  }

  @Get('/template-type')
  public async getTemplateTypeStats(): Promise<any> {
    return await this.templateService.getTemplateTypeStats();
  }
}
