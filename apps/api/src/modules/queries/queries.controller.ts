import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { QueriesService } from './queries.service';

@Controller('queries')
export class QueriesController {
    constructor(private readonly queriesService: QueriesService) { }

    @Post('execute')
    async executeQuery(@Body() body: { datasetId: string; sql: string }) {
        return this.queriesService.executeQuery(body.datasetId, body.sql);
    }

    @Get('history/:datasetId')
    async getHistory(@Param('datasetId') datasetId: string) {
        return this.queriesService.getHistory(datasetId);
    }
}
