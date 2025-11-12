import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PermitService } from './permit.service';
import { permitDto } from './permit.dto';
import { User } from '@/common/decorators/user.decorator';

@Controller('permit')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @Post()
  async create(@Body() payload: permitDto, @User() user: any) {
    return await this.permitService.create(payload, user);
  }

  @Get(':id')
  async getDetailPermit(@Param('id') id: number) {
    return await this.permitService.getDetailPermit(id);
  }
}
