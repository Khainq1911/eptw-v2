import { Body, Controller, Post } from '@nestjs/common';
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
}
