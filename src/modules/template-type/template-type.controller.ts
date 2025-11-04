import { Controller, Get } from '@nestjs/common';
import { TemplateTypeService } from './template-type.service';

@Controller('template-type')
export class TemplateTypeController {
  constructor(private readonly templateTypeService: TemplateTypeService) {}

  @Get()
  async getApprovalTypes() {
    return await this.templateTypeService.getTemplateTypes();
  }
}
