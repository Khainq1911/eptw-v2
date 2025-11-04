import { Module } from '@nestjs/common';
import { ApprovalTypeController } from './approval-type.controller';
import { ApprovalTypeService } from './approval-type.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalTypeEntity } from '@/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalTypeEntity])],
  controllers: [ApprovalTypeController],
  providers: [ApprovalTypeService],
})
export class ApprovalTypeModule {}
