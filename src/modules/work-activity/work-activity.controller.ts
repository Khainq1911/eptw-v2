import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WorkActivityService } from './work-activity.service';
import { createDto } from './work-activity.dto';

@Controller('work-activity')
export class WorkActivityController {
  constructor(private readonly workActivityService: WorkActivityService) {}

  @Post()
  async create(@Body() payload: createDto) {
    return await this.workActivityService.create(payload);
  }

  @Get()
  async findAll() {
    return await this.workActivityService.findAll();
  }

  @Get(':id')
  async findOne(@Query('id') id: number) {
    return await this.workActivityService.findOne(id);
  }
}
