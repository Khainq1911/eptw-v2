import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { User } from '@/common/decorators/user.decorator';
import { TemplateDto, UpdateTemplateDto } from './template.dto';
import { UserJwtPayloadDto } from '../auth/auth.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLE } from '@/common/enum';
import { QueryDto } from '@/common/constants';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Roles(ROLE.ADMIN)
  @Post('')
  async create(@User() user: UserJwtPayloadDto, @Body() body: TemplateDto) {
    return await this.templateService.create(user, body);
  }

  @Roles(ROLE.ADMIN)
  @Put('/:id')
  async update(
    @User() user: UserJwtPayloadDto,
    @Param('id') id: number,
    @Body() body: UpdateTemplateDto,
  ) {
    return await this.templateService.update(id, user, body);
  }

  @Roles(ROLE.ADMIN)
  @Patch('delete/:id')
  async delete(@User() user: UserJwtPayloadDto, @Param('id') id: number) {
    return await this.templateService.delete(id, user);
  }

  @Post('list')
  async list(@Body() query: QueryDto) {
    return await this.templateService.list(query);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.templateService.findOne(id);
  }
}
