import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Fastify from 'fastify';
import { schemaService } from './schema.service';
import { safeExecService } from './safe-exec.service';
import { datasetMappingService } from './dataset-mapping.service';
import {
    McpDbActions,
    McpSchemaResponse,
    McpQueryResult,
    McpErrorResponse
} from '../../../packages/shared-types/mcp-db';

// Define the Tool interface based on MCP concepts
interface Tool {
    name: string;
    description: string;
    execute: (action: string, params: any) => Promise<any>;
}

export const DBTool: Tool = {
    name: 'database',
    description: 'PostgreSQL Database Tool for Schema Inspection and Safe Query Execution',
    execute: async (action: string, params: any) => {
        try {
            switch (action as McpDbActions) {
                case 'ping':
                    return { ok: true, timestamp: Date.now() };

                case 'getSchema':
                    return await schemaService.getSchema();

                case 'getTables':
                    return await schemaService.listTables();

                case 'getColumns':
                    if (!params.tableName) {
                        throw { code: 'VALIDATION_ERROR', message: 'tableName is required' };
                    }
                    return await schemaService.listColumns(params.tableName);

                case 'describeTable':
                    if (!params.tableName) {
                        throw { code: 'VALIDATION_ERROR', message: 'tableName is required' };
                    }
                    return await schemaService.describeTable(params.tableName);

                case 'executeQuery':
                    if (!params.sql) {
                        throw { code: 'VALIDATION_ERROR', message: 'sql is required' };
                    }
                    return await safeExecService.executeSafeQuery(params.sql);

                case 'getDatasetTable':
                    if (!params.datasetId) {
                        throw { code: 'VALIDATION_ERROR', message: 'datasetId is required' };
                    }
                    return await datasetMappingService.getDatasetTables(params.datasetId);

                default:
                    throw { code: 'NOT_FOUND', message: `Unknown action: ${action}` };
            }
        } catch (error: any) {
            // Consistent error wrapping with structured codes
            return {
                error: error.message || 'Unknown error occurred',
                code: error.code || 'UNKNOWN_ERROR',
                details: error.details
            } as McpErrorResponse;
        }
    }
};

export async function startServer(config: { tools: Tool[], port: number }) {
    const server: FastifyInstance = Fastify({ logger: true });

    // MCP Protocol Endpoint (Simplified JSON-RPC style for now)
    server.post('/mcp_db', async (req: FastifyRequest, reply: FastifyReply) => {
        const body = req.body as any;
        const { tool: toolName, action, params } = body;

        const tool = config.tools.find(t => t.name === toolName);
        if (!tool) {
            return reply.status(404).send({ error: `Tool '${toolName}' not found` } as McpErrorResponse);
        }

        try {
            const result = await tool.execute(action, params);
            return { result };
        } catch (error: any) {
            return reply.status(500).send({ error: error.message } as McpErrorResponse);
        }
    });

    // Health check
    server.get('/health', async () => {
        return { status: 'ok' };
    });

    try {
        await server.listen({ port: config.port, host: '0.0.0.0' });
        console.log(`MCP Server running on port ${config.port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
