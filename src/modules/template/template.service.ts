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
    this.validateCreate(body);

    try {
      await this.templateRepository.save({
        ...body,
        approvalType: { id: body.approvalTypeId },
        templateType: { id: body.templateTypeId },
        createdBy: { id: user.id },
        updatedBy: { id: user.id },
      });

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to create template: ' + (error.message || ''),
        500,
      );
    }
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
        createdAt: query.sort,
      },
      relations: ['approvalType', 'createdBy', 'updatedBy'],
    });

    return {
      data: templates,
      total: count,
    };
  }

  private validateCreate(body: TemplateDto) {
    const errors: string[] = [];

    if (!body.name) {
      errors.push('Tên mẫu là bắt buộc');
    }

    if (!body.templateTypeId) {
      errors.push('Loại mẫu là bắt buộc');
    }

    if (!body.approvalTypeId) {
      errors.push('Loại phê duyệt là bắt buộc');
    }

    if (!body.sections || body.sections.length === 0) {
      errors.push('Danh sách phần (section) là bắt buộc');
    } else {
      body.sections.forEach((section, index) => {
        if (!section.name) {
          errors.push(`Phần ${index + 1}: Tên phần là bắt buộc`);
        }
        if (section.sign?.required && !section.sign.roleIdAllowed) {
          errors.push(`Phần ${index + 1}: Vai trò phê duyệt là bắt buộc`);
        }
      });
    }

    if (errors.length > 0) {
      throw new HttpException(errors.join('; '), 400);
    }
  }
}
