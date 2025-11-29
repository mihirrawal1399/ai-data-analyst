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
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_DELAY_MS = 1000;

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
            // Fallback: construct from MCP_DB_PORT
            const port = this.configService.get<string>('MCP_DB_PORT');
            if (!port) {
                throw new Error('MCP DB endpoint not configured. Set MCP_DB_URL or MCP_DB_PORT.');
            }
            this.mcpUrl = `http://localhost:${port}/mcp_db`;
        }
    }

    private async callTool<T>(action: McpDbActions, params: any = {}, retryCount = 0): Promise<T> {
        const startTime = Date.now();
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

            // Check for MCP error response in result
            if (data.error) {
                throw new Error(this.translateError(data));
            }

            // Log successful call performance
            this.logPerformance(action, Date.now() - startTime, retryCount);

            return data.result as T;
        } catch (error: any) {
            clearTimeout(id);

            // Retry on transient errors
            if (this.isRetriableError(error) && retryCount < this.MAX_RETRIES) {
                const delay = this.RETRY_DELAY_MS * Math.pow(2, retryCount);
                this.logger.warn(`Retrying ${action} after ${delay}ms (attempt ${retryCount + 1}/${this.MAX_RETRIES})`);
                await this.delay(delay);
                return this.callTool<T>(action, params, retryCount + 1);
            }

            if (error.name === 'AbortError') {
                throw new Error(`MCP Tool request timed out after ${this.timeoutMs}ms`);
            }

            throw new Error(this.translateError(error));
        }
    }

    private isRetriableError(error: any): boolean {
        return (
            error.name === 'AbortError' ||
            error.code === 'CONNECTION_ERROR' ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ENOTFOUND') ||
            error.message?.includes('ETIMEDOUT')
        );
    }

    private translateError(error: any): string {
        const errorMap: Record<string, string> = {
            'VALIDATION_ERROR': 'Invalid request parameters',
            'EXECUTION_ERROR': 'Query execution failed',
            'CONNECTION_ERROR': 'Database connection error',
            'NOT_FOUND': 'Resource not found'
        };

        return errorMap[error.code] || error.error || error.message || 'Unknown error occurred';
    }

    private logPerformance(action: string, latency: number, retries: number): void {
        this.logger.log(`[${action}] Latency: ${latency}ms, Retries: ${retries}`);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    /**
     * Get list of all tables in the database
     */
    async getTables(): Promise<string[]> {
        return this.callTool<string[]>('getTables');
    }

    /**
     * Get columns for a specific table
     */
    async getColumns(tableName: string): Promise<any[]> {
        return this.callTool<any[]>('getColumns', { tableName });
    }

    async getDatasetTable(datasetId: string): Promise<any> {
        return this.callTool('getDatasetTable', { datasetId });
    }
}
