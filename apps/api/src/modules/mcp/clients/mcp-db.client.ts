import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    McpDbActions,
    McpSchemaResponse,
    McpQueryResult,
    McpErrorResponse
} from '../../../../../../packages/shared-types/mcp-db';

@Injectable()
export class McpDbClient {
    private readonly logger = new Logger(McpDbClient.name);
    private mcpUrl: string;
    private timeoutMs: number = 10000; // 10s timeout

    constructor(private configService: ConfigService) {
        const rawUrl = this.configService.get<string>('MCP_DB_URL');
        if (rawUrl) {
            // Resolve possible ${MCP_DB_PORT} placeholder using env values
            const interpolated = rawUrl.replace(/\${(.*?)}/g, (_, varName) => {
                const val = this.configService.get<string>(varName) || process.env[varName];
                if (!val) {
                    throw new Error(`Environment variable ${varName} required for MCP_DB_URL interpolation`);
                }
                return val;
            });
            this.mcpUrl = interpolated;
        } else {
            // Fallback: construct from MCP_DB_PORT (or MCP_PORT for backward compatibility)
            const port = this.configService.get<string>('MCP_DB_PORT') || this.configService.get<string>('MCP_PORT');
            if (!port) {
                throw new Error('MCP DB endpoint not configured. Set MCP_DB_URL or MCP_DB_PORT/MCP_PORT.');
            }
            this.mcpUrl = `http://localhost:${port}/mcp_db`;
        }
    }

    private async callTool<T>(action: McpDbActions, params: any = {}): Promise<T> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), this.timeoutMs);

        try {
            const response = await fetch(this.mcpUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: 'database',
                    action,
                    params,
                }),
                signal: controller.signal,
            });

            clearTimeout(id);

            if (!response.ok) {
                const errorText = await response.text();
                let errorDetails: any;
                try {
                    const jsonError = JSON.parse(errorText) as McpErrorResponse;
                    errorDetails = jsonError.error || errorText;
                } catch {
                    errorDetails = errorText;
                }

                this.logger.error(`MCP Tool Error (${response.status}): ${errorDetails}`);
                throw new Error(`MCP Tool Error: ${errorDetails}`);
            }

            const data = await response.json();
            return data.result as T;
        } catch (error: any) {
            clearTimeout(id);
            if (error.name === 'AbortError') {
                throw new Error(`MCP Tool request timed out after ${this.timeoutMs}ms`);
            }
            throw error;
        }
    }

    async ping(): Promise<{ ok: boolean; timestamp: number }> {
        return this.callTool('ping');
    }

    async getSchema(datasetId?: string): Promise<McpSchemaResponse> {
        // Note: datasetId might be used in future for multi-tenant DBs
        // For now, we just get the schema of the connected DB
        const tables = await this.callTool<string[]>('getTables');

        const schema: McpSchemaResponse = { tables: [] };

        for (const tableName of tables) {
            const tableInfo = await this.callTool<any>('describeTable', { tableName });
            schema.tables.push({
                name: tableInfo.table_name,
                columns: tableInfo.columns.map((c: any) => ({
                    name: c.column_name,
                    type: c.data_type,
                    nullable: c.is_nullable === 'YES',
                })),
            });
        }

        return schema;
    }

    async executeQuery(sql: string): Promise<McpQueryResult> {
        const rows = await this.callTool<any[]>('executeQuery', { sql });

        // Infer columns from the first row if available
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

        return {
            columns,
            rows,
            rowCount: rows.length,
        };
    }
}
