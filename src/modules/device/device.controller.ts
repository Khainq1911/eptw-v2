import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import type { DeviceDto } from './device.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLE } from '@/common/enum';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('list')
  async list() {
    return await this.deviceService.list();
  }

  @Roles(ROLE.ADMIN)
  @Post('create')
  async create(@Body() deviceDto: DeviceDto) {
    return await this.deviceService.create(deviceDto);
  }

  @Roles(ROLE.ADMIN)
  @Put('update')
  async update(@Body() deviceDto: DeviceDto, @Query('id') id: number) {
    return await this.deviceService.update(deviceDto, id);
  }

  @Roles(ROLE.ADMIN)
  @Delete('delete')
  async delete(@Query('id') id: number) {
    return await this.deviceService.delete(id);
  }
}
