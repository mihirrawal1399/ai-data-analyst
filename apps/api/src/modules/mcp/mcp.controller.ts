import { Controller, Get, Post, Body } from '@nestjs/common';
import { McpService } from './mcp.service';
import { McpDbClient } from './clients/mcp-db.client';

@Controller('mcp')
export class McpController {
    constructor(
        private readonly mcpService: McpService,
        private readonly mcpDbClient: McpDbClient,
    ) { }

    @Get('status')
    getStatus() {
        return this.mcpService.getStatus();
    }

    @Get('db/health')
    async getDbHealth() {
        const start = Date.now();
        try {
            const ping = await this.mcpDbClient.ping();
            const latency = Date.now() - start;
            return {
                status: 'ok',
                latency,
                mcpTimestamp: ping.timestamp,
            };
        } catch (error) {
            return {
                status: 'error',
                latency: Date.now() - start,
                error: error.message,
            };
        }
    }

    @Post('tools/execute')
    executeTool(@Body() body: { tool: string; params: any }) {
        return this.mcpService.executeTool(body.tool, body.params);
    }
}
