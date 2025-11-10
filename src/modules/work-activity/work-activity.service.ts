import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createDto } from './work-activity.dto';

@Injectable()
export class WorkActivityService {
  constructor(
    @InjectRepository(WorkActivityEntity)
    private readonly workActivityRepository: Repository<WorkActivityEntity>,
  ) {}

  async create(payload: createDto): Promise<{ message: string }> {
    console.log(payload);
    await this.workActivityRepository.save(payload);
    return { message: 'success' };
  }

  async findAll() {
    return await this.workActivityRepository.find();
  }

  async findOne(id: number) {
    return await this.workActivityRepository.findOne({ where: { id } });
  }
}
