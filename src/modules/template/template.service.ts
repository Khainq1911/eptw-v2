import { TemplateEntity } from '@/database/entities';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { UserJwtPayloadDto } from '../auth/auth.dto';
import { TemplateDto, UpdateTemplateDto } from './template.dto';
import { QueryDto } from '@/common/constants';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly templateRepository: Repository<TemplateEntity>,
  ) {}

  async create(
    user: UserJwtPayloadDto,
    body: TemplateDto,
  ): Promise<{ message: string }> {
    await this.templateRepository.save({
      ...body,
      approvalType: { id: body.approvalTypeId },
      createdBy: { id: user.id },
      updatedBy: { id: user.id },
    });
    return { message: 'success' };
  }

  async update(id: number, user: UserJwtPayloadDto, body: UpdateTemplateDto) {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['approvalType', 'createdBy', 'updatedBy'],
    });

    if (!template) {
      throw new HttpException('Template not found', 404);
    }

    let payload;

    const { approvalTypeId, ...rest } = body;
    payload = {
      ...rest,
      updatedBy: { id: user.id },
    };
    if (body.approvalTypeId) {
      payload.approvalType = { id: body.approvalTypeId };
    }

    await this.templateRepository.update(id, payload);

    return { message: 'success' };
  }

  async delete(id: number, user: UserJwtPayloadDto) {
    const isExisted = await this.templateRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!isExisted) {
      throw new HttpException('Template already deleted', 400);
    }

    await this.templateRepository.update(id, {
      deletedBy: { id: user.id },
    });

    await this.templateRepository.softDelete(id);

    return { message: 'success' };
  }

  async list(query: QueryDto) {
    const whereCondition = query.search
      ? { name: ILike(`%${query.search}%`) }
      : {};

    const [templates, count] = await this.templateRepository.findAndCount({
      where: whereCondition,
      skip: (query.page - 1) * query.limit || 0,
      take: query.limit,
      withDeleted: false,
      order: {
        created_at: query.sort,
      },
      relations: ['approvalType', 'createdBy', 'updatedBy'],
    });

    return {
      data: templates,
      total: count,
    };
  }
}
