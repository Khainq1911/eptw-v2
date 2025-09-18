import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import type { DeviceDto } from './device.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLE } from '@/common/enum';
import { get } from 'http';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('list')
  async list() {
    return await this.deviceService.list();
  }

  @Get(':id')
  public async getDeviceById(@Param('id') id: number) {
    return await this.deviceService.getDeviceById(id);
  }

  @Roles(ROLE.ADMIN)
  @Post('create')
  async create(@Body() deviceDto: DeviceDto) {
    return await this.deviceService.create(deviceDto);
  }

  @Roles(ROLE.ADMIN)
  @Post('update/:id')
  async update(@Body() deviceDto: DeviceDto, @Param('id') id: number) {
    return await this.deviceService.update(deviceDto, id);
  }

  @Roles(ROLE.ADMIN)
  @Patch('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.deviceService.delete(id);
  }
}
