import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
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
}
