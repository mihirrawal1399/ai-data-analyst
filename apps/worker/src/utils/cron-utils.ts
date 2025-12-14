import * as cronParser from 'cron-parser';

/**
 * Compute the next run time from a cron expression
 */
export function computeNextRun(cronExpression: string): Date {
    try {
        const interval = cronParser.parseExpression(cronExpression);
        return interval.next().toDate();
    } catch (error) {
        throw new Error(`Invalid cron expression: ${cronExpression}`);
    }
}

/**
 * Validate a cron expression
 */
export function isValidCron(expression: string): boolean {
    try {
        cronParser.parseExpression(expression);
        return true;
    } catch {
        return false;
    }
}
