import * as cronParser from 'cron-parser';

/**
 * Validate a cron expression
 */
export function parseCronExpression(expression: string): boolean {
    try {
        cronParser.parseExpression(expression);
        return true;
    } catch {
        return false;
    }
}

/**
 * Compute the next run time from a cron expression
 */
export function computeNextRun(expression: string): Date {
    const interval = cronParser.parseExpression(expression);
    return interval.next().toDate();
}

/**
 * Common cron expressions
 */
export const CronPresets = {
    EVERY_HOUR: '0 * * * *',
    EVERY_DAY_9AM: '0 9 * * *',
    EVERY_MONDAY_9AM: '0 9 * * 1',
    EVERY_WEEK: '0 9 * * 0',
    EVERY_MONTH: '0 9 1 * *',
} as const;
