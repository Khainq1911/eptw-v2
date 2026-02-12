import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PermitLogEntity } from "@/database/entities/permit-log.entity";
import { Repository } from "typeorm";
import { CreatePermitLogDto } from "./permit-log.dto";

@Injectable()
export class PermitLogService {
    constructor(
        @InjectRepository(PermitLogEntity)
        private readonly permitLogRepository: Repository<PermitLogEntity>,
    ) {}

    async create(permitLog: CreatePermitLogDto) {
        return await this.permitLogRepository.save(permitLog);
    }

    async findByPermitId(permitId: number) {
        return await this.permitLogRepository.find({
            where: { permit: { id: permitId } },
        });
    }
}