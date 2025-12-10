import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PermitService } from './permit.service';
import { filterDto, permitDto } from './permit.dto';
import { User } from '@/common/decorators/user.decorator';

@Controller('permit')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @Post()
  async create(@Body() payload: permitDto, @User() user: any) {
    return await this.permitService.create(payload, user);
  }

  @Post('/send-otp')
  async sendOtp(@User() user: any) {
    return await this.permitService.sendOtp(user);
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() payload: any, @User() user: any) {
    return await this.permitService.signSection(payload, user);
  }

  @Post('/section/reject')
  async rejectSection(@Body() payload: any) {
    return await this.permitService.rejectSection(payload);
  }

  @Post('/list')
  async getListPermit(@Body() payload: filterDto, @User() user: any) {
    return await this.permitService.getListPermit(payload, user);
  }

  @Post('/update')
  async updatePermit(@Body() payload: any, @User() user: any) {
    return await this.permitService.updatePermit(payload, user);
  }

  @Post('/update-status')
  async updatePermitStatus(@Body() payload: any, @User() user: any) {
    return await this.permitService.updatePermitStatus(payload, user);
  }

  @Patch('/reject')
  async rejectPermit(@Body() payload: any, @User() user: any) {
    return await this.permitService.rejectPermit(payload, user);
  }

  @Post('/:id')
  async getDetailPermit(
    @Body() payload: any,
    @Param('id') id: number,
    @User() user: any,
  ) {
    return await this.permitService.getDetailPermit(id, payload.action, user);
  }

  @Post('/delete/:id')
  async deletePermit(@Param('id') id: number, @User() user: any) {
    return await this.permitService.deletePermit(id, user);
  }

  @Get('/dashboard')
  async getDashboard(@User() user: any) {
    return await this.permitService.getDashboardStats(user);
  }
}
