import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { DeviceService } from './device.service';
import type { DeviceDto } from './device.dto';
import { Public } from '@/common/decorators/auth.decorator';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Public()
  @Post('create')
  async create(@Body() deviceDto: DeviceDto) {
    return await this.deviceService.create(deviceDto);
  }

  @Public()
  @Get('list')
  async list() {
    return await this.deviceService.list();
  }

  @Public()
  @Put('update')
  async update(@Body() deviceDto: DeviceDto, @Query('id') id: number) {
    return await this.deviceService.update(deviceDto, id);
  }
}
