import { Controller, Get, Post, Body } from '@nestjs/common';
import { McpService } from './mcp.service';

@Controller('mcp')
export class McpController {
    constructor(private readonly mcpService: McpService) { }

    @Get('status')
    async getStatus() {
        return this.mcpService.getStatus();
    }

    @Post('tools')
    async executeTool(@Body() body: { toolName: string; arguments: any }) {
        return this.mcpService.executeTool(body.toolName, body.arguments);
    }
}
