import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';
import { computeNextRun } from './utils/cron-utils';

export class RunnerService {
    private apiClient: AxiosInstance;

    constructor(apiBaseUrl: string) {
        this.apiClient = axios.create({
            baseURL: apiBaseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Execute a single automation
     */
    async executeAutomation(automation: any): Promise<void> {
        const startTime = Date.now();

        logger.info({
            automationId: automation.id,
            name: automation.name,
            type: automation.type,
        }, 'Starting automation execution');

        try {
            // Execute automation via API
            const response = await this.apiClient.post(
                `/automations/${automation.id}/execute`
            );

            const result = response.data;
            const duration = Date.now() - startTime;

            if (result.success) {
                logger.info({
                    automationId: automation.id,
                    duration,
                    output: result.output?.substring(0, 200), // Log first 200 chars
                }, 'Automation executed successfully');

                // Update scheduling metadata
                await this.updateScheduling(automation);
            } else {
                logger.error({
                    automationId: automation.id,
                    error: result.error,
                    duration,
                }, 'Automation execution failed');
            }
        } catch (error: any) {
            const duration = Date.now() - startTime;

            logger.error({
                automationId: automation.id,
                error: error.message,
                duration,
                stack: error.stack,
            }, 'Error executing automation');
        }
    }

    /**
     * Update automation scheduling after execution
     */
    private async updateScheduling(automation: any): Promise<void> {
        try {
            const nextRun = computeNextRun(automation.schedule);

            await this.apiClient.patch(`/automations/${automation.id}`, {
                lastRun: new Date().toISOString(),
                nextRun: nextRun.toISOString(),
            });

            logger.debug({
                automationId: automation.id,
                nextRun,
            }, 'Updated scheduling metadata');
        } catch (error: any) {
            logger.error({
                automationId: automation.id,
                error: error.message,
            }, 'Failed to update scheduling');
        }
    }

    /**
     * Get automation details
     */
    async getAutomation(id: string): Promise<any> {
        try {
            const response = await this.apiClient.get(`/automations/${id}`);
            return response.data;
        } catch (error: any) {
            logger.error({
                automationId: id,
                error: error.message,
            }, 'Failed to fetch automation details');
            throw error;
        }
    }
}
