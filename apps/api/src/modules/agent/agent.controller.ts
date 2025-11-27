import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    @Post('query')
    async naturalLanguageQuery(@Body() body: { datasetId: string; question: string }) {
        return this.agentService.processQuery(body.datasetId, body.question);
    }

    @Post('analyze')
    async analyzeDataset(@Body() body: { datasetId: string }) {
        return this.agentService.analyzeDataset(body.datasetId);
    }
}
