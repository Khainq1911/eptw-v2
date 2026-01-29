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
  Res,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import type { DeviceDto, FilterDto } from './device.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLE } from '@/common/enum';
import { Response } from 'express';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('list')
  async list(@Body() filter: FilterDto) {
    return await this.deviceService.list(filter);
  }

  @Get('list-devices')
  async listDevices() {
    return await this.deviceService.listDevices();
  }

  @Get('/free-and-active')
  async getFreeAndActiveDevices() {
    return await this.deviceService.getFreeAndActiveDevices();
  }

  @Get('/location')
  async getListDevicePosition() {
    return await this.deviceService.getListDevicePosition();
  }

  @Roles([ROLE.ADMIN])
  @Post('create')
  async create(@Body() deviceDto: DeviceDto) {
    return await this.deviceService.create(deviceDto);
  }

  @Roles([ROLE.ADMIN])
  @Post('update/:id')
  async update(@Body() deviceDto: DeviceDto, @Param('id') id: number) {
    return await this.deviceService.update(deviceDto, id);
  }

  @Roles([ROLE.ADMIN])
  @Patch('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.deviceService.delete(id);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    return await this.deviceService.exportExcel(res);
  }

  @Get(':id')
  public async getDeviceById(@Param('id') id: number) {
    return await this.deviceService.getDeviceById(id);
  }
}
