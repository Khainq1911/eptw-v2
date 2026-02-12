import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PermitLogService } from "./permit-log.service";
import { CreatePermitLogDto } from "./permit-log.dto";

@Controller('permit-log')
export class PermitLogController {
    constructor(
        private readonly permitLogService: PermitLogService,
    ) {}

    @Post()
    async create(@Body() permitLog: CreatePermitLogDto) {
        return await this.permitLogService.create(permitLog);
    }

    @Get()
    async findByPermitId(@Query() query: { permitId: number }) {
        return await this.permitLogService.findByPermitId(query.permitId);
    }
}