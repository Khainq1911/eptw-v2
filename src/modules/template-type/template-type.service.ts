import { TemplateTypeEntity } from '@/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTemplateTypeDto,
  filter,
  UpdateTemplateTypeDto,
} from './template-type.dto';

@Injectable()
export class TemplateTypeService {
  constructor(
    @InjectRepository(TemplateTypeEntity)
    private readonly repo: Repository<TemplateTypeEntity>,
  ) {}

  async getTemplateTypes() {
    return await this.repo.find();
  }

  async create(dto: CreateTemplateTypeDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(filter: filter) {
    return this.repo.find({
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
    });
  }

  async findOne(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`TemplateType ${id} not found`);
    }
    return entity;
  }

  async update(id: number, dto: UpdateTemplateTypeDto) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.softDelete(id);
    return { success: true };
  }
}
