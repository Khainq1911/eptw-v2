import { ApprovalTypeEntity } from '@/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApprovalTypeService {
  constructor(
    @InjectRepository(ApprovalTypeEntity)
    private readonly approvalTypeRepository: Repository<ApprovalTypeEntity>,
  ) {}

  async getApprovalTypes() {
    return await this.approvalTypeRepository.find();
  }
}
