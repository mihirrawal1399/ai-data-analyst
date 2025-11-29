import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { LLMService } from './llm.service';
import { McpModule } from '../mcp/mcp.module';

@Module({
    imports: [McpModule],
    controllers: [AgentController],
    providers: [
        AgentService,
        LLMService,
    ],
    exports: [AgentService],
})
export class AgentModule { }
