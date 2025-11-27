import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { AgentService } from '../agent/agent.service';
import type { RunQueryDto } from './dto/run-query.dto';

@Controller('queries')
export class QueriesController {
    constructor(
        private readonly queriesService: QueriesService,
        private readonly agentService: AgentService,
    ) { }

    @Post('run')
    async runNaturalLanguageQuery(@Body() dto: RunQueryDto) {
        return this.agentService.processQuery(
            dto.datasetId,
            dto.question,
            {
                limit: dto.limit,
                userApiKey: dto.userApiKey,
            },
        );
    }

    @Post('execute')
    async executeQuery(@Body() body: { datasetId: string; sql: string }) {
        return this.queriesService.executeQuery(body.datasetId, body.sql);
    }

    @Get('history/:datasetId')
    async getHistory(@Param('datasetId') datasetId: string) {
        return this.queriesService.getHistory(datasetId);
    }
}
