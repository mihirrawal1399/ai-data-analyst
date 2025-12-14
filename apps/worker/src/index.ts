import * as dotenv from 'dotenv';
import { logger } from './logger';
import { SchedulerService } from './scheduler.service';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';
const POLL_INTERVAL = parseInt(process.env.WORKER_POLL_INTERVAL || '60000', 10);

/**
 * Print startup banner
 */
function printBanner(): void {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Automation Worker Online');
    console.log('='.repeat(50));
    console.log(`API:              ${API_BASE_URL}`);
    console.log(`Polling Interval: ${POLL_INTERVAL / 1000}s`);
    console.log(`Log Level:        ${process.env.WORKER_LOG_LEVEL || 'info'}`);
    console.log('='.repeat(50) + '\n');
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
    try {
        printBanner();

        const scheduler = new SchedulerService(API_BASE_URL, POLL_INTERVAL);
        scheduler.start();

        logger.info('Worker initialized successfully');

        // Graceful shutdown
        process.on('SIGINT', () => {
            logger.info('Received SIGINT, shutting down gracefully...');
            scheduler.stop();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            logger.info('Received SIGTERM, shutting down gracefully...');
            scheduler.stop();
            process.exit(0);
        });

        // Handle uncaught errors
        process.on('uncaughtException', (error) => {
            logger.fatal({ error: error.message, stack: error.stack }, 'Uncaught exception');
            // Don't exit - worker should keep running
        });

        process.on('unhandledRejection', (reason) => {
            logger.error({ reason }, 'Unhandled promise rejection');
            // Don't exit - worker should keep running
        });
    } catch (error: any) {
        logger.fatal({ error: error.message, stack: error.stack }, 'Failed to start worker');
        process.exit(1);
    }
}

// Start the worker
main();
