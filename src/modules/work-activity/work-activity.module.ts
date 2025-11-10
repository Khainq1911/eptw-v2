import { WorkActivityEntity } from '@/database/entities/work-activity.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkActivityController } from './work-activity.controller';
import { WorkActivityService } from './work-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkActivityEntity])],
  controllers: [WorkActivityController],
  providers: [WorkActivityService],
})
export class WorkActivityModule {}
