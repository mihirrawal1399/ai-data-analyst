import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';
import { RunnerService } from './runner.service';

export class SchedulerService {
    private apiClient: AxiosInstance;
    private runner: RunnerService;
    private pollInterval: number;
    private intervalId?: NodeJS.Timeout;
    private isRunning = false;
    private executingAutomations = new Set<string>();

    constructor(apiBaseUrl: string, pollInterval: number) {
        this.apiClient = axios.create({
            baseURL: apiBaseUrl,
            timeout: 10000,
        });
        this.runner = new RunnerService(apiBaseUrl);
        this.pollInterval = pollInterval;
    }

    /**
     * Start the scheduler polling loop
     */
    start(): void {
        if (this.isRunning) {
            logger.warn('Scheduler already running');
            return;
        }

        this.isRunning = true;
        logger.info({
            pollInterval: this.pollInterval,
        }, 'Starting scheduler');

        // Run immediately, then on interval
        this.checkAndRunAutomations();

        this.intervalId = setInterval(
            () => this.checkAndRunAutomations(),
            this.pollInterval
        );
    }

    /**
     * Stop the scheduler
     */
    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
        this.isRunning = false;
        logger.info('Scheduler stopped');
    }

    /**
     * Check for due automations and execute them
     */
    private async checkAndRunAutomations(): Promise<void> {
        try {
            const dueAutomations = await this.getDueAutomations();

            if (dueAutomations.length === 0) {
                logger.debug('No due automations found');
                return;
            }

            logger.info({
                count: dueAutomations.length,
            }, 'Found due automations');

            for (const automation of dueAutomations) {
                // Skip if already executing
                if (this.executingAutomations.has(automation.id)) {
                    logger.debug({
                        automationId: automation.id,
                    }, 'Automation already executing, skipping');
                    continue;
                }

                // Mark as executing
                this.executingAutomations.add(automation.id);

                // Execute asynchronously (don't await)
                this.runner
                    .executeAutomation(automation)
                    .finally(() => {
                        this.executingAutomations.delete(automation.id);
                    });
            }
        } catch (error: any) {
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                logger.error({
                    error: error.message,
                    code: error.code,
                }, 'API unreachable, will retry on next poll');
            } else {
                logger.error({
                    error: error.message,
                    stack: error.stack,
                }, 'Error checking automations');
            }
        }
    }

    /**
     * Fetch due automations from API
     */
    private async getDueAutomations(): Promise<any[]> {
        try {
            const response = await this.apiClient.get('/automations/due');
            return response.data;
        } catch (error: any) {
            if (error.response) {
                logger.error({
                    status: error.response.status,
                    data: error.response.data,
                }, 'API error fetching due automations');
            }
            throw error;
        }
    }
}
