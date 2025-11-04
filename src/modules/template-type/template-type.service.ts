import { TemplateTypeEntity } from '@/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TemplateTypeService {
  constructor(
    @InjectRepository(TemplateTypeEntity)
    private readonly templateTypeRepository: Repository<TemplateTypeEntity>,
  ) {}

  async getTemplateTypes() {
    return await this.templateTypeRepository.find();
  }
}
