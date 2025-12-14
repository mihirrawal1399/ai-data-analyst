import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { AgentService } from '../agent/agent.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { parseCronExpression, computeNextRun } from './utils/cron.util';
import { AutomationResult } from '@repo/shared-types/automation';

@Injectable()
export class AutomationsService {
    constructor(
        private prisma: PrismaService,
        private agentService: AgentService,
    ) { }

    async createAutomation(dto: CreateAutomationDto) {
        // Validate cron expression
        if (!parseCronExpression(dto.schedule)) {
            throw new HttpException('Invalid cron expression', HttpStatus.BAD_REQUEST);
        }

        const nextRun = computeNextRun(dto.schedule);

        return this.prisma.automation.create({
            data: {
                ...dto,
                nextRun,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.automation.findMany({
            where: { userId },
            include: {
                dashboard: true,
                dataset: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const automation = await this.prisma.automation.findUnique({
            where: { id },
            include: {
                dashboard: true,
                dataset: true,
            },
        });

        if (!automation) {
            throw new HttpException('Automation not found', HttpStatus.NOT_FOUND);
        }

        return automation;
    }

    async update(id: string, dto: UpdateAutomationDto) {
        // Validate cron if provided
        if (dto.schedule && !parseCronExpression(dto.schedule)) {
            throw new HttpException('Invalid cron expression', HttpStatus.BAD_REQUEST);
        }

        const data: any = { ...dto };

        // Recompute nextRun if schedule changed
        if (dto.schedule) {
            data.nextRun = computeNextRun(dto.schedule);
        }

        return this.prisma.automation.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.automation.delete({
            where: { id },
        });
    }

    /**
     * Get automations that are due to run
     */
    async getDueAutomations() {
        return this.prisma.automation.findMany({
            where: {
                enabled: true,
                nextRun: { lte: new Date() },
            },
            include: {
                user: true,
                dashboard: true,
                dataset: true,
            },
        });
    }

    /**
     * Mark automation as run and compute next run time
     */
    async markAutomationRun(id: string) {
        const automation = await this.findOne(id);
        const nextRun = computeNextRun(automation.schedule);

        return this.prisma.automation.update({
            where: { id },
            data: {
                lastRun: new Date(),
                nextRun,
            },
        });
    }

    /**
     * Execute an automation
     */
    async executeAutomation(automation: any): Promise<AutomationResult> {
        try {
            let output: string;

            switch (automation.type) {
                case 'summary':
                    output = await this.executeSummary(automation);
                    break;
                case 'alert':
                    output = await this.executeAlert(automation);
                    break;
                case 'trend':
                    output = await this.executeTrend(automation);
                    break;
                default:
                    throw new Error(`Unknown automation type: ${automation.type}`);
            }

            // Mark as completed
            await this.markAutomationRun(automation.id);

            return {
                success: true,
                output,
                executedAt: new Date(),
            };
        } catch (error) {
            return {
                success: false,
                output: null,
                error: error.message,
                executedAt: new Date(),
            };
        }
    }

    private async executeSummary(automation: any): Promise<string> {
        if (automation.dashboardId) {
            return this.agentService.generateDashboardSummary(automation.dashboardId);
        } else if (automation.datasetId) {
            return this.agentService.generateDatasetSummary(automation.datasetId);
        }
        throw new Error('No dashboard or dataset specified for summary');
    }

    private async executeAlert(automation: any): Promise<string> {
        if (!automation.datasetId) {
            throw new Error('Dataset required for alert automation');
        }
        return this.agentService.checkAlertCondition(
            automation.datasetId,
            automation.config
        );
    }

    private async executeTrend(automation: any): Promise<string> {
        if (!automation.datasetId) {
            throw new Error('Dataset required for trend automation');
        }
        return this.agentService.detectTrends(
            automation.datasetId,
            automation.config
        );
    }
}
