import { Controller, Get } from '@nestjs/common';
import { ApprovalTypeService } from './approval-type.service';

@Controller('approval-type')
export class ApprovalTypeController {
  constructor(private readonly approvalTypeService: ApprovalTypeService) {}

  @Get()
  async getApprovalTypes() {
    return await this.approvalTypeService.getApprovalTypes();
  }
}
