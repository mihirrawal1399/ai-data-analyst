import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from '../../../generated/prisma/client';
import { LLMService } from './llm.service';
import { SchemaService } from './schema.service';
import { SQLValidatorService } from './sql-validator.service';
import { LLMProviderOptions, UsageMetrics } from './types/llm-config.types';
import { buildSQLGenerationPrompt } from './prompts/sql-generation.prompt';
import { buildResultSummaryPrompt } from './prompts/result-summary.prompt';
import { McpDbClient } from '../mcp/clients/mcp-db.client';

@Injectable()
export class AgentService {
    constructor(
        private prisma: PrismaService,
        private llmService: LLMService,
        private schemaService: SchemaService,
        private sqlValidator: SQLValidatorService,
        private mcpDbClient: McpDbClient,
    ) { }

    /**
     * Process natural language query and return SQL results with summary
     */
    async processQuery(
        datasetId: string,
        question: string,
        options: {
            limit?: number;
            userId?: string;
            userApiKey?: string;
        } = {}
    ) {
        const startTime = Date.now();

        try {
            // 1. Fetch dataset schema (logical)
            const dataset = await this.schemaService.getDatasetSchema(datasetId);
            const schemaInfo = this.schemaService.formatSchemaForLLM(dataset);

            // 2. Get sample rows from first table (using McpDbClient)
            const firstTable = dataset.tables[0];
            if (!firstTable) {
                throw new Error('Dataset has no tables');
            }

            // We use McpDbClient to execute a safe query for sample rows
            const sampleQuery = `SELECT * FROM "${firstTable.name}" LIMIT 3`;
            const sampleResult = await this.mcpDbClient.executeQuery(sampleQuery);

            const sampleRowsText = this.schemaService.formatSampleRowsForLLM(sampleResult.rows);

            // 3. Build LLM options
            const llmOptions: LLMProviderOptions = {
                userId: options.userId,
                useUserKey: !!options.userApiKey,
                apiKey: options.userApiKey,
            };

            // 4. Generate SQL
            const sqlPrompt = buildSQLGenerationPrompt({
                datasetName: dataset.name,
                schemaInfo,
                sampleRows: sampleRowsText,
                question,
                rowLimit: options.limit || 100,
            });

            const { sql: generatedSQL, metrics: sqlMetrics } =
                await this.llmService.generateSQL(sqlPrompt, llmOptions);

            const cleanedSQL = this.sqlValidator.cleanSQL(generatedSQL);

            // 5. Validate SQL
            const allowedTables = dataset.tables.map(t => t.name);
            const validation = this.sqlValidator.validateSQL(
                cleanedSQL,
                allowedTables,
            );

            if (!validation.isValid) {
                throw new Error(`Invalid SQL: ${validation.errors.join(', ')}`);
            }

            // 6. Execute SQL via MCP
            const queryResult = await this.mcpDbClient.executeQuery(validation.validatedSQL);
            const rowCount = queryResult.rowCount;
            const queryResultRows = queryResult.rows;

            // 7. Generate summary
            const summaryPrompt = buildResultSummaryPrompt({
                question,
                sql: validation.validatedSQL,
                rowCount: rowCount,
                results: queryResultRows,
            });

            const { summary, metrics: summaryMetrics } =
                await this.llmService.summarizeResults(summaryPrompt, llmOptions);

            // 8. Calculate total usage
            const totalMetrics: UsageMetrics = {
                tokensUsed: sqlMetrics.tokensUsed + summaryMetrics.tokensUsed,
                estimatedCost: sqlMetrics.estimatedCost + summaryMetrics.estimatedCost,
                provider: sqlMetrics.provider,
                model: sqlMetrics.model,
                usedSystemKey: sqlMetrics.usedSystemKey,
            };

            // 9. Log query
            await this.prisma.queryLog.create({
                data: {
                    datasetId,
                    question,
                    sql: validation.validatedSQL,
                    resultPreview: queryResultRows.slice(0, 10),
                },
            });

            // 10. Return response
            const executionTime = Date.now() - startTime;

            // Infer columns from first row if available
            const columns = queryResult.columns;

            return {
                question,
                sql: validation.validatedSQL,
                results: {
                    rows: queryResultRows,
                    rowCount: rowCount,
                    columns: columns,
                },
                summary,
                executionTimeMs: executionTime,
                usage: totalMetrics,
                llmProvider: this.llmService.getProviderInfo(llmOptions),
            };

        } catch (error) {
            // Log failed query
            await this.prisma.queryLog.create({
                data: {
                    datasetId,
                    question,
                    sql: null,
                    resultPreview: Prisma.DbNull,
                },
            });

            throw new Error(`Query processing failed: ${error.message}`);
        }
    }

    async analyzeDataset(datasetId: string) {
        // TODO: Implement AI-powered dataset analysis and insights
        // For now, return basic metadata

        const dataset = await this.prisma.dataset.findUnique({
            where: { id: datasetId },
            include: {
                tables: {
                    include: {
                        columns: true,
                    },
                },
            },
        });

        if (!dataset) {
            throw new Error('Dataset not found');
        }

        return {
            message: 'AI agent analysis - to be implemented',
            dataset: {
                id: dataset.id,
                name: dataset.name,
                tableCount: dataset.tables.length,
                totalColumns: dataset.tables.reduce((sum, table) => sum + table.columns.length, 0),
            },
        };
    }
}
