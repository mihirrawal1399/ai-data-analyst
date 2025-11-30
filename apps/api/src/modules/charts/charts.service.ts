import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { McpDbClient } from '../mcp/clients/mcp-db.client';
import { ChartConfig, ChartDataPoint } from '../../../../../packages/shared-types';
import { CreateChartDto, UpdateChartDto } from './dto/chart.dto';

@Injectable()
export class ChartsService {
    private readonly logger = new Logger(ChartsService.name);

    constructor(
        private prisma: PrismaService,
        private mcpDbClient: McpDbClient,
    ) { }

    async create(data: CreateChartDto) {
        // Validate that dataset exists
        const dataset = await this.prisma.dataset.findUnique({
            where: { id: data.datasetId },
            include: { tables: true },
        });

        if (!dataset) {
            throw new HttpException('Dataset not found', HttpStatus.NOT_FOUND);
        }

        // Validate that dashboard exists
        const dashboard = await this.prisma.dashboard.findUnique({
            where: { id: data.dashboardId },
        });

        if (!dashboard) {
            throw new HttpException('Dashboard not found', HttpStatus.NOT_FOUND);
        }

        return this.prisma.chart.create({
            data: {
                dashboardId: data.dashboardId,
                datasetId: data.datasetId,
                title: data.title || null,
                type: data.type,
                config: data.config as any,
            },
        });
    }

    async findOne(id: string, includeData = false) {
        const chart = await this.prisma.chart.findUnique({
            where: { id },
            include: {
                dashboard: true,
                dataset: {
                    include: {
                        tables: true,
                    },
                },
            },
        });

        if (!chart) {
            throw new HttpException('Chart not found', HttpStatus.NOT_FOUND);
        }

        if (includeData) {
            const data = await this.executeChartQuery(id);
            return {
                ...chart,
                data,
            };
        }

        return chart;
    }

    async update(id: string, data: UpdateChartDto) {
        // Verify chart exists
        const chart = await this.prisma.chart.findUnique({
            where: { id },
        });

        if (!chart) {
            throw new HttpException('Chart not found', HttpStatus.NOT_FOUND);
        }

        return this.prisma.chart.update({
            where: { id },
            data: {
                title: data.title,
                type: data.type,
                config: data.config as any,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.chart.delete({
            where: { id },
        });
    }

    /**
     * Execute chart query and return formatted data points
     */
    async executeChartQuery(chartId: string): Promise<ChartDataPoint[]> {
        try {
            // 1. Fetch chart with dataset info
            const chart = await this.prisma.chart.findUnique({
                where: { id: chartId },
                include: {
                    dataset: {
                        include: {
                            tables: true,
                        },
                    },
                },
            });

            if (!chart) {
                throw new HttpException('Chart not found', HttpStatus.NOT_FOUND);
            }

            const config = chart.config as unknown as ChartConfig;

            // 2. Get dataset table mapping from MCP
            const datasetTables = await this.mcpDbClient.getDatasetTable(chart.datasetId);
            if (!datasetTables.tables || datasetTables.tables.length === 0) {
                throw new HttpException('Dataset has no tables', HttpStatus.NOT_FOUND);
            }

            // Use first table for now (can be enhanced to support multi-table joins)
            const tableName = datasetTables.tables[0].name;

            // 3. Build SQL query from config
            const sql = this.buildChartSQL(config, tableName);

            this.logger.log(`Executing chart query: ${sql}`);

            // 4. Execute via MCP DB Client
            const result = await this.mcpDbClient.executeQuery(sql);

            // 5. Return formatted data points
            return result.rows;

        } catch (error) {
            this.logger.error(`Chart query execution failed: ${error.message}`, error.stack);
            throw this.translateToHttpException(error);
        }
    }

    /**
     * Build SQL query from chart configuration
     */
    private buildChartSQL(config: ChartConfig, tableName: string): string {
        const parts: string[] = [];

        // SELECT clause
        let selectClause = 'SELECT ';
        const selectFields: string[] = [];

        // Add x-axis (always a column)
        selectFields.push(`"${config.xAxis}"`);

        // Add y-axis (could be column or aggregation)
        if (this.isAggregation(config.yAxis)) {
            selectFields.push(`${config.yAxis} as value`);
        } else {
            selectFields.push(`"${config.yAxis}" as value`);
        }

        selectClause += selectFields.join(', ');
        parts.push(selectClause);

        // FROM clause
        parts.push(`FROM "${tableName}"`);

        // WHERE clause (filters)
        if (config.filters && config.filters.length > 0) {
            const whereConditions = config.filters.map(filter => {
                return this.buildFilterCondition(filter);
            });
            parts.push(`WHERE ${whereConditions.join(' AND ')}`);
        }

        // GROUP BY clause
        if (config.groupBy || this.isAggregation(config.yAxis)) {
            const groupByColumn = config.groupBy || config.xAxis;
            parts.push(`GROUP BY "${groupByColumn}"`);
        }

        // ORDER BY clause
        if (config.orderBy) {
            const direction = config.orderDirection || 'ASC';
            parts.push(`ORDER BY "${config.orderBy}" ${direction}`);
        } else if (config.groupBy || this.isAggregation(config.yAxis)) {
            // Default ordering by x-axis if grouped
            parts.push(`ORDER BY "${config.xAxis}" ASC`);
        }

        // LIMIT clause
        const limit = config.limit || 1000;
        parts.push(`LIMIT ${limit}`);

        return parts.join(' ');
    }

    /**
     * Check if a field is an aggregation function
     */
    private isAggregation(field: string): boolean {
        const aggregationPattern = /^(COUNT|SUM|AVG|MIN|MAX|STDDEV|VARIANCE)\s*\(/i;
        return aggregationPattern.test(field);
    }

    /**
     * Build SQL condition from filter
     */
    private buildFilterCondition(filter: any): string {
        const { column, operator, value } = filter;

        // Handle different operators
        switch (operator) {
            case 'IN':
            case 'NOT IN':
                const values = Array.isArray(value) ? value : [value];
                const valueList = values.map(v => this.escapeValue(v)).join(', ');
                return `"${column}" ${operator} (${valueList})`;

            case 'LIKE':
                return `"${column}" LIKE ${this.escapeValue(value)}`;

            default:
                return `"${column}" ${operator} ${this.escapeValue(value)}`;
        }
    }

    /**
     * Escape SQL values to prevent injection
     */
    private escapeValue(value: any): string {
        if (value === null || value === undefined) {
            return 'NULL';
        }

        if (typeof value === 'number') {
            return value.toString();
        }

        if (typeof value === 'boolean') {
            return value ? 'TRUE' : 'FALSE';
        }

        // String values - escape single quotes
        return `'${value.toString().replace(/'/g, "''")}'`;
    }

    /**
     * Translate errors to HTTP exceptions
     */
    private translateToHttpException(error: any): HttpException {
        if (error instanceof HttpException) {
            return error;
        }

        const message = error.message || 'Unknown error';

        // Invalid SQL or validation errors -> 400
        if (message.includes('Invalid SQL') ||
            message.includes('validation') ||
            message.includes('unsafe') ||
            message.includes('not allowed') ||
            message.includes('column') && message.includes('does not exist')) {
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
            'Chart query execution failed',
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
