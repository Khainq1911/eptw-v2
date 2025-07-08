import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
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
  @Post('create')
  async create(@User() user: UserJwtPayloadDto, @Body() body: TemplateDto) {
    return await this.templateService.create(user, body);
  }

  @Roles(ROLE.ADMIN)
  @Put('update/:id')
  async update(
    @User() user: UserJwtPayloadDto,
    @Param('id') id: number,
    @Body() body: UpdateTemplateDto,
  ) {
    return await this.templateService.update(id, user, body);
  }

  @Roles(ROLE.ADMIN)
  @Put('delete/:id')
  async delete(@User() user: UserJwtPayloadDto, @Param('id') id: number) {
    return await this.templateService.delete(id, user);
  }

  @Get('list')
  async list(@Query() query: QueryDto) {
    return await this.templateService.list(query);
  }
}
