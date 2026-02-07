import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WorkActivityService } from './work-activity.service';
import {
  CreateWorkActivityDto,
  FilterWorkActivityDto,
  UpdateWorkActivityDto,
} from './work-activity.dto';

@Controller('work-activity')
export class WorkActivityController {
  constructor(private readonly workActivityService: WorkActivityService) { }

  @Get()
  async findAll() {
    return await this.workActivityService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateWorkActivityDto) {
    return await this.workActivityService.create(payload);
  }

  @Post('list')
  async list(@Body() filter: FilterWorkActivityDto) {
    return await this.workActivityService.list(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.workActivityService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateWorkActivityDto,
  ) {
    return await this.workActivityService.update(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.workActivityService.delete(id);
  }
}
