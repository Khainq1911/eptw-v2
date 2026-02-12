import { Module } from "@nestjs/common";
import { PermitLogController } from "./permit-log.controller";
import { PermitLogService } from "./permit-log.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermitLogEntity } from "@/database/entities/permit-log.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PermitLogEntity])],
    controllers: [PermitLogController],
    providers: [PermitLogService],
    exports: [PermitLogService],
})
export class PermitLogModule {}