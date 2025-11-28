import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { McpDbClient } from './clients/mcp-db.client';

@Module({
    imports: [ConfigModule],
    controllers: [McpController],
    providers: [McpService, McpDbClient],
    exports: [McpService, McpDbClient],
})
export class McpModule { }
