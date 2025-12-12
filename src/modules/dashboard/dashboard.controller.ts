import { Controller, Get } from '@nestjs/common';
import { PermitService } from '../permit/permit.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly permitService: PermitService) {}

  @Get("/permit-template")
  public async getDashboardStats(user: any): Promise<any> {
    return await this.permitService.getDashboardStats(user);
  }
}
