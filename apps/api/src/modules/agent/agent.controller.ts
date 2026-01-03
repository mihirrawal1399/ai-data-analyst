import { Controller, Post, Body, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AgentService } from './agent.service';

// DTO for query request
interface QueryRequestDto {
    datasetId: string;
    question: string;
    limit?: number;
    userId?: string;
    userApiKey?: string;
}

@Controller('agent')
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    /**
     * Process natural language query
     * POST /agent/query
     * 
     * Body: {
     *   datasetId: string,
     *   question: string,
     *   limit?: number,
     *   userId?: string,
     *   userApiKey?: string
     * }
     */
    @Post('query')
    @HttpCode(HttpStatus.OK)
    async naturalLanguageQuery(@Body() body: QueryRequestDto) {
        return this.agentService.processQuery(
            body.datasetId,
            body.question,
            {
                limit: body.limit,
                userId: body.userId,
                userApiKey: body.userApiKey,
            }
        );
    }

    /**
     * Analyze dataset
     * POST /agent/analyze
     */
    @Post('analyze')
    @HttpCode(HttpStatus.OK)
    async analyzeDataset(@Body() body: { datasetId: string }) {
        return this.agentService.analyzeDataset(body.datasetId);
    }

    /**
     * Get dashboard insights
     * POST /agent/insights/dashboard/:dashboardId
     */
    @Post('insights/dashboard/:dashboardId')
    @HttpCode(HttpStatus.OK)
    async getDashboardInsights(@Param('dashboardId') dashboardId: string) {
        return this.agentService.analyzeDashboard(dashboardId);
    }

    /**
     * Get dataset insights
     * POST /agent/insights/dataset/:datasetId
     */
    @Post('insights/dataset/:datasetId')
    @HttpCode(HttpStatus.OK)
    async getDatasetInsights(@Param('datasetId') datasetId: string) {
        return this.agentService.analyzeDataset(datasetId);
    }

    /**
     * Suggest charts for a dataset
     * POST /agent/suggest-charts/:datasetId
     */
    @Post('suggest-charts/:datasetId')
    @HttpCode(HttpStatus.OK)
    async suggestCharts(@Param('datasetId') datasetId: string) {
        return this.agentService.suggestCharts(datasetId);
    }
}

