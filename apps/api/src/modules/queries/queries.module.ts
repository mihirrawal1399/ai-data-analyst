import { Module } from '@nestjs/common';
import { QueriesController } from './queries.controller';
import { QueriesService } from './queries.service';
import { AgentModule } from '../agent/agent.module';

@Module({
    imports: [AgentModule],
    controllers: [QueriesController],
    providers: [QueriesService],
    exports: [QueriesService],
})
export class QueriesModule { }
