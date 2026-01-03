import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from '@prisma/client';
import { LLMService } from './llm.service';
import { LLMProviderOptions, UsageMetrics } from './types/llm-config.types';
import { buildSQLGenerationPrompt } from './prompts/sql-generation.prompt';
import { buildResultSummaryPrompt } from './prompts/result-summary.prompt';
import { McpDbClient } from '../mcp/clients/mcp-db.client';

@Injectable()
export class AgentService {
    constructor(
        private prisma: PrismaService,
        private llmService: LLMService,
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
            // 1. Get dataset table mapping from MCP
            const datasetTables = await this.mcpDbClient.getDatasetTable(datasetId);
            if (!datasetTables.tables || datasetTables.tables.length === 0) {
                throw new HttpException('Dataset has no tables', HttpStatus.NOT_FOUND);
            }

            // 2. Build enhanced schema context with column details
            const schemaInfo = await this.buildSchemaContext(datasetTables);

            // 3. Get sample rows from first table
            const firstTable = datasetTables.tables[0];
            const sampleQuery = `SELECT * FROM "${firstTable.name}" LIMIT 3`;
            const sampleResult = await this.mcpDbClient.executeQuery(sampleQuery);

            const sampleRowsText = this.formatSampleRows(sampleResult.rows);

            // 4. Build LLM options
            const llmOptions: LLMProviderOptions = {
                userId: options.userId,
                useUserKey: !!options.userApiKey,
                apiKey: options.userApiKey,
            };

            // 5. Generate SQL with enhanced schema context
            const sqlPrompt = buildSQLGenerationPrompt({
                datasetName: datasetId,
                schemaInfo,
                sampleRows: sampleRowsText,
                question,
                rowLimit: options.limit || 100,
            });

            const { sql: generatedSQL, metrics: sqlMetrics } =
                await this.llmService.generateSQL(sqlPrompt, llmOptions);

            // 6. Clean SQL (remove markdown)
            const cleanedSQL = this.cleanSQL(generatedSQL);

            // 7. Execute via MCP (validation happens in MCP tool automatically)

            const queryResult = await this.mcpDbClient.executeQuery(cleanedSQL);
            const rowCount = queryResult.rowCount;
            const queryResultRows = queryResult.rows;

            // 8. Generate summary
            const summaryPrompt = buildResultSummaryPrompt({
                question,
                sql: cleanedSQL,
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
                    sql: cleanedSQL,
                    resultPreview: queryResultRows.slice(0, 10),
                },
            });

            // 10. Return response
            const executionTime = Date.now() - startTime;

            // Infer columns from first row if available
            const columns = queryResult.columns;

            return {
                question,
                sql: cleanedSQL,
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
            try {
                await this.prisma.queryLog.create({
                    data: {
                        datasetId,
                        question,
                        sql: null,
                        resultPreview: Prisma.DbNull,
                    },
                });
            } catch (logError) {
                this.logger.error('Failed to log query:', logError);
            }

            // Translate to HTTP exception
            throw this.translateToHttpException(error);
        }
    }

    /**
     * Build schema context with column details for LLM
     */
    private async buildSchemaContext(datasetTables: any): Promise<string> {
        let schema = '';
        for (const table of datasetTables.tables) {
            const columns = await this.mcpDbClient.getColumns(table.name);
            schema += `Table: ${table.name} (${table.rowCount} rows)\n`;
            schema += `Columns:\n`;
            columns.forEach(col => {
                schema += `  - ${col.column_name} (${col.data_type})${col.is_nullable === 'YES' ? ' [nullable]' : ''}\n`;
            });
            schema += `\n`;
        }
        return schema;
    }

    /**
     * Format sample rows for LLM
     */
    private formatSampleRows(rows: any[]): string {
        if (rows.length === 0) return 'No sample data available';
        return JSON.stringify(rows, null, 2);
    }

    /**
     * Clean SQL by removing markdown code blocks
     */
    private cleanSQL(sql: string): string {
        // Remove markdown code blocks
        sql = sql.replace(/```sql\n?/g, '').replace(/```\n?/g, '');
        // Remove extra whitespace
        return sql.trim();
    }

    /**
     * Generate dataset summary for automation
     */
    async generateDatasetSummary(datasetId: string): Promise<string> {
        try {
            const datasetTables = await this.mcpDbClient.getDatasetTable(datasetId);
            if (!datasetTables.tables || datasetTables.tables.length === 0) {
                return 'No data available in this dataset';
            }

            const firstTable = datasetTables.tables[0];
            const sampleQuery = `SELECT * FROM "${firstTable.name}" LIMIT 10`;
            const sampleData = await this.mcpDbClient.executeQuery(sampleQuery);

            const prompt = `Generate a concise summary of this dataset:\n\nTable: ${firstTable.name}\nRow count: ${firstTable.rowCount}\nSample data: ${JSON.stringify(sampleData.rows, null, 2)}\n\nProvide key insights and statistics.`;

            const { summary } = await this.llmService.summarizeResults(prompt, {});
            return summary;
        } catch (error) {
            return `Error generating summary: ${error.message}`;
        }
    }

    /**
     * Generate dashboard summary for automation
     */
    async generateDashboardSummary(dashboardId: string): Promise<string> {
        try {
            const dashboard = await this.prisma.dashboard.findUnique({
                where: { id: dashboardId },
                include: { charts: true },
            });

            if (!dashboard) {
                return 'Dashboard not found';
            }

            const summaries: string[] = [];
            summaries.push(`Dashboard: ${dashboard.name}`);
            summaries.push(`Total charts: ${dashboard.charts.length}`);
            summaries.push('');

            // Generate brief summary for each chart
            for (const chart of dashboard.charts) {
                summaries.push(`- ${chart.title || chart.type + ' chart'}: ${chart.type} visualization`);
            }

            return summaries.join('\n');
        } catch (error) {
            return `Error generating dashboard summary: ${error.message}`;
        }
    }

    /**
     * Detect trends in dataset for automation
     */
    async detectTrends(datasetId: string, config: any): Promise<string> {
        try {
            const datasetTables = await this.mcpDbClient.getDatasetTable(datasetId);
            if (!datasetTables.tables || datasetTables.tables.length === 0) {
                return 'No data available for trend analysis';
            }

            const firstTable = datasetTables.tables[0];
            const metrics = config.metrics || ['*'];
            const timeRange = config.timeRange || '7d';

            // Simple trend query (assumes there's a date column)
            const query = `
                SELECT ${metrics.join(', ')}
                FROM "${firstTable.name}"
                ORDER BY created_at DESC
                LIMIT 100
            `;

            const data = await this.mcpDbClient.executeQuery(query);

            const prompt = `Analyze these trends and identify patterns:\n${JSON.stringify(data.rows, null, 2)}\n\nFocus on: ${metrics.join(', ')}\nTime range: ${timeRange}`;

            const { summary } = await this.llmService.summarizeResults(prompt, {});
            return summary;
        } catch (error) {
            return `Error detecting trends: ${error.message}`;
        }
    }

    /**
     * Check alert conditions for automation
     */
    async checkAlertCondition(datasetId: string, config: any): Promise<string> {
        try {
            const datasetTables = await this.mcpDbClient.getDatasetTable(datasetId);
            if (!datasetTables.tables || datasetTables.tables.length === 0) {
                return 'No data available for alert check';
            }

            const firstTable = datasetTables.tables[0];
            const thresholds = config.thresholds || [];
            const alerts: string[] = [];

            for (const threshold of thresholds) {
                const query = `
                    SELECT ${threshold.metric}
                    FROM "${firstTable.name}"
                    ORDER BY created_at DESC
                    LIMIT 1
                `;

                const result = await this.mcpDbClient.executeQuery(query);
                if (result.rows.length === 0) continue;

                const value = result.rows[0][threshold.metric];
                const breached = this.checkThreshold(value, threshold);

                if (breached) {
                    alerts.push(
                        `⚠️ Alert: ${threshold.metric} is ${value} (threshold: ${threshold.operator} ${threshold.value})`
                    );
                }
            }

            return alerts.length > 0
                ? alerts.join('\n')
                : 'No alerts triggered';
        } catch (error) {
            return `Error checking alerts: ${error.message}`;
        }
    }

    /**
     * Check if value breaches threshold
     */
    private checkThreshold(value: number, threshold: any): boolean {
        switch (threshold.operator) {
            case '>': return value > threshold.value;
            case '<': return value < threshold.value;
            case '>=': return value >= threshold.value;
            case '<=': return value <= threshold.value;
            case '=': return value === threshold.value;
            default: return false;
        }
    }

    /**
     * Translate errors to HTTP exceptions with user-friendly messages
     */
    private translateToHttpException(error: any): HttpException {
        // Already an HTTP exception
        if (error instanceof HttpException) {
            return error;
        }

        const message = error.message || 'Unknown error';

        // Invalid SQL or validation errors -> 400
        if (message.includes('Invalid SQL') ||
            message.includes('validation') ||
            message.includes('unsafe') ||
            message.includes('not allowed')) {
            return new HttpException(
                message,
                HttpStatus.BAD_REQUEST
            );
        }

        // Not found errors -> 404
        if (message.includes('not found') || message.includes('does not exist')) {
            return new HttpException(
                message,
                HttpStatus.NOT_FOUND
            );
        }

        // Default to 500 for execution failures
        return new HttpException(
            'Query execution failed',
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    private readonly logger = new (class {
        error(message: string, error?: any) {
            console.error(`[AgentService] ${message}`, error);
        }
    })();

    async analyzeDataset(datasetId: string) {
        const dataset = await this.prisma.dataset.findUnique({
            where: { id: datasetId },
            include: {
                tables: { include: { columns: true } },
            },
        });

        if (!dataset) {
            throw new HttpException('Dataset not found', HttpStatus.NOT_FOUND);
        }

        // Fetch sample data via MCP
        const datasetTables = await this.mcpDbClient.getDatasetTable(datasetId);
        const firstTable = datasetTables.tables?.[0];
        let sampleData: any[] = [];
        if (firstTable) {
            const result = await this.mcpDbClient.executeQuery(`SELECT * FROM "${firstTable.name}" LIMIT 20`);
            sampleData = result.rows;
        }

        const prompt = `Analyze this dataset and provide structured insights:

Dataset: ${dataset.name}
Tables: ${dataset.tables.map(t => t.name).join(', ')}
Columns: ${dataset.tables.flatMap(t => t.columns.map(c => `${c.name} (${c.dataType})`)).join(', ')}
Sample Data: ${JSON.stringify(sampleData.slice(0, 5), null, 2)}

Provide a JSON response with:
1. "summary": Brief overview of the dataset
2. "columnDescriptions": Array of {name, description, sampleValues}
3. "trends": Array of {metric, direction, description}
4. "chartSuggestions": Array of {type, title, xAxis, yAxis, reason}
5. "dataQualityIssues": Array of {column, issueType, severity, description}

Return ONLY valid JSON.`;

        const { summary: rawResponse } = await this.llmService.summarizeResults(prompt, {});

        try {
            const insights = JSON.parse(rawResponse);
            return {
                ...insights,
                generatedAt: new Date(),
            };
        } catch {
            return {
                summary: rawResponse,
                columnDescriptions: [],
                trends: [],
                chartSuggestions: [],
                dataQualityIssues: [],
                generatedAt: new Date(),
            };
        }
    }

    async analyzeDashboard(dashboardId: string) {
        const dashboard = await this.prisma.dashboard.findUnique({
            where: { id: dashboardId },
            include: {
                charts: { include: { dataset: true } },
            },
        });

        if (!dashboard) {
            throw new HttpException('Dashboard not found', HttpStatus.NOT_FOUND);
        }

        // Build context from all charts
        const chartSummaries = dashboard.charts.map(chart => ({
            title: chart.title,
            type: chart.type,
            datasetName: chart.dataset?.name,
            config: chart.config,
        }));

        const prompt = `Analyze this dashboard and provide insights:

Dashboard: ${dashboard.name}
Charts: ${JSON.stringify(chartSummaries, null, 2)}

Provide a JSON response with:
1. "summary": Overview of dashboard purpose and key metrics
2. "patterns": Array of {metric, direction, percentageChange, description, confidence}
3. "anomalies": Array of {metric, value, expectedRange, severity, description}
4. "chartSuggestions": Array of {type, title, xAxis, yAxis, reason}
5. "recommendedFilters": Array of filter suggestions

Return ONLY valid JSON.`;

        const { summary: rawResponse } = await this.llmService.summarizeResults(prompt, {});

        try {
            const insights = JSON.parse(rawResponse);
            return {
                ...insights,
                generatedAt: new Date(),
            };
        } catch {
            return {
                summary: rawResponse,
                patterns: [],
                anomalies: [],
                chartSuggestions: [],
                recommendedFilters: [],
                generatedAt: new Date(),
            };
        }
    }

    async suggestCharts(datasetId: string) {
        const datasetTables = await this.mcpDbClient.getDatasetTable(datasetId);
        if (!datasetTables.tables || datasetTables.tables.length === 0) {
            return { suggestions: [] };
        }

        const firstTable = datasetTables.tables[0];
        const result = await this.mcpDbClient.executeQuery(`SELECT * FROM "${firstTable.name}" LIMIT 10`);

        const prompt = `Given this data sample, suggest 3-5 useful chart visualizations:

Columns: ${firstTable.columns.map((c: any) => `${c.name} (${c.dataType})`).join(', ')}
Sample: ${JSON.stringify(result.rows.slice(0, 3), null, 2)}

Return JSON array of {type, title, xAxis, yAxis, reason}.`;

        const { summary: rawResponse } = await this.llmService.summarizeResults(prompt, {});

        try {
            return { suggestions: JSON.parse(rawResponse) };
        } catch {
            return { suggestions: [], rawResponse };
        }
    }
}

