import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ChartsService } from '../charts/charts.service';

@Injectable()
export class DashboardsService {
    private readonly logger = new Logger(DashboardsService.name);

    constructor(
        private prisma: PrismaService,
        private chartsService: ChartsService,
    ) { }

    async create(data: { name: string; userId: string; layout?: any }) {
        return this.prisma.dashboard.create({
            data: {
                name: data.name,
                userId: data.userId,
                layout: data.layout || null,
            },
        });
    }

    async findAll() {
        return this.prisma.dashboard.findMany({
            include: {
                charts: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.dashboard.findUnique({
            where: { id },
            include: {
                charts: true,
                user: true,
            },
        });
    }

    /**
     * Find dashboard with all chart data executed
     */
    async findOneWithData(id: string) {
        try {
            // 1. Fetch dashboard with charts
            const dashboard = await this.prisma.dashboard.findUnique({
                where: { id },
                include: {
                    charts: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });

            if (!dashboard) {
                throw new HttpException('Dashboard not found', HttpStatus.NOT_FOUND);
            }

            // 2. Execute all chart queries in parallel
            const chartsWithData = await Promise.allSettled(
                dashboard.charts.map(async (chart) => {
                    try {
                        const data = await this.chartsService.executeChartQuery(chart.id);
                        return {
                            ...chart,
                            data,
                        };
                    } catch (error) {
                        // Log error but don't fail entire dashboard
                        this.logger.error(
                            `Failed to execute chart ${chart.id}: ${error.message}`,
                            error.stack
                        );
                        return {
                            ...chart,
                            data: [],
                            error: error.message || 'Failed to execute chart query',
                        };
                    }
                })
            );

            // 3. Extract results (both successful and failed)
            const charts = chartsWithData.map((result) => {
                if (result.status === 'fulfilled') {
                    return result.value;
                } else {
                    // This shouldn't happen since we catch errors above
                    this.logger.error(`Unexpected chart execution failure: ${result.reason}`);
                    return null;
                }
            }).filter(chart => chart !== null);

            // 4. Return combined response
            return {
                ...dashboard,
                charts,
            };

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            this.logger.error(`Dashboard aggregation failed: ${error.message}`, error.stack);
            throw new HttpException(
                'Failed to load dashboard with data',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(id: string, data: { name?: string; layout?: any }) {
        return this.prisma.dashboard.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.dashboard.delete({
            where: { id },
        });
    }
}
