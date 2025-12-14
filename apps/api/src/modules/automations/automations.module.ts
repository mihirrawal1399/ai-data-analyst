import { Module } from '@nestjs/common';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';
import { AgentModule } from '../agent/agent.module';

@Module({
    imports: [AgentModule],
    controllers: [AutomationsController],
    providers: [AutomationsService],
    exports: [AutomationsService],
})
export class AutomationsModule { }
