import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateWorkActivityDto,
  FilterWorkActivityDto,
  UpdateWorkActivityDto,
} from './work-activity.dto';
import AppDataSource from '@/database/data-source';

@Injectable()
export class WorkActivityService {
  constructor(
    @InjectRepository(WorkActivityEntity)
    private readonly workActivityRepository: Repository<WorkActivityEntity>,
  ) { }

  async findAll() {
    return await this.workActivityRepository.find();
  }
  
  async create(
    payload: CreateWorkActivityDto,
  ): Promise<{ message: string }> {
    await this.workActivityRepository.save(payload);
    return { message: 'Work activity created successfully' };
  }

  async list(filter: FilterWorkActivityDto) {
    const qb = AppDataSource.getRepository(WorkActivityEntity)
      .createQueryBuilder('workActivity')
      .orderBy('workActivity.updatedAt', 'DESC')
      .limit(filter.limit)
      .offset((filter.page - 1) * filter.limit);

    if (filter.name) {
      qb.andWhere('workActivity.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.category) {
      qb.andWhere('workActivity.category = :category', {
        category: filter.category,
      });
    }

    if (filter.riskLevel) {
      qb.andWhere('workActivity.riskLevel = :riskLevel', {
        riskLevel: filter.riskLevel,
      });
    }

    const [workActivities, total] = await qb.getManyAndCount();

    return {
      items: workActivities,
      total,
    };
  }

  async findOne(id: number) {
    const workActivity = await this.workActivityRepository.findOne({
      where: { id },
    });

    if (!workActivity) {
      throw new HttpException('Work activity not found', 404);
    }

    return workActivity;
  }

  async update(
    id: number,
    payload: UpdateWorkActivityDto,
  ): Promise<{ message: string }> {
    const existingWorkActivity = await this.workActivityRepository.findOne({
      where: { id },
    });

    if (!existingWorkActivity) {
      throw new HttpException('Work activity not found', 404);
    }

    await this.workActivityRepository.update(id, payload);

    return { message: 'Work activity updated successfully' };
  }

  async delete(id: number): Promise<{ message: string }> {
    const existingWorkActivity = await this.workActivityRepository.findOne({
      where: { id },
    });

    if (!existingWorkActivity) {
      throw new HttpException('Work activity not found', 404);
    }

    await this.workActivityRepository.delete(id);

    return { message: 'Work activity deleted successfully' };
  }
}
