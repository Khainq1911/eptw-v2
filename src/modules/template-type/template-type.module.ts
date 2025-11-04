import { TemplateTypeEntity } from '@/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateTypeService } from './template-type.service';
import { TemplateTypeController } from './template-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateTypeEntity])],
  controllers: [TemplateTypeController],
  providers: [TemplateTypeService],
})
export class TemplateTypeModule {}
