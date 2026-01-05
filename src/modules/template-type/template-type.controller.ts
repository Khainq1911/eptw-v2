import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TemplateTypeService } from './template-type.service';
import { CreateTemplateTypeDto, filter, UpdateTemplateTypeDto } from './template-type.dto';

@Controller('template-types')
export class TemplateTypeController {
  constructor(private readonly service: TemplateTypeService) {}

  @Get()
  async getApprovalTypes() {
    return await this.service.getTemplateTypes();
  }

  @Post()
  create(@Body() dto: CreateTemplateTypeDto) {
    return this.service.create(dto);
  }

  @Post("filter")
  findAll(@Body() filter: filter) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateTemplateTypeDto,
  ) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
