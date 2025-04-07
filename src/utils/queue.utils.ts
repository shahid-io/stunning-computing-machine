/**
 * Names of the queues used in the system.
 */
export const QUEUE_NAMES = {
    TASKS: 'tasks',
    EMAILS: 'emails',
} as const;


export const PROCESSOR_QUEUE_NAMES = {
    TASKS: 'tasks',
    PROCESS: 'process',
} as const;
/**
 * Default configuration for queues.
 */
export const DEFAULT_QUEUE_CONFIG = {
    LIMITER: {
        /**
         * Maximum number of jobs allowed in the queue within the duration.
         */
        MAX: 5,

        /**
         * Duration in milliseconds for the rate limiter.
         */
        DURATION_MS: 60 * 1000,
    },
    JOB: {
        /**
         * Default number of attempts for a job.
         */
        ATTEMPTS: 3,

        /**
         * Backoff configuration for retrying jobs.
         */
        BACKOFF: {
            /**
             * Type of backoff strategy.
             */
            TYPE: 'exponential' as const,

            /**
             * Delay in milliseconds for the backoff.
             */
            DELAY_MS: 1000,
        },
    },
} as const;

/**
 * Type representing the backoff strategy.
 */
export type BackoffType = 'exponential' | 'fixed';

/**
 * Generates queue configuration based on environment variables or defaults.
 * @param configService - Service to fetch configuration values.
 * @returns The queue configuration object.
 */
export const getQueueConfig = (configService: {
    get: (key: string) => string | undefined;
}) => ({
    limiter: {
        max: parseInt(
            configService.get('RATE_LIMIT') ||
                DEFAULT_QUEUE_CONFIG.LIMITER.MAX.toString()
        ),
        duration: parseInt(
            configService.get('RATE_LIMIT_WINDOW') ||
                DEFAULT_QUEUE_CONFIG.LIMITER.DURATION_MS.toString()
        ),
    },
    defaultJobOptions: {
        attempts: parseInt(
            configService.get('QUEUE_ATTEMPTS') ||
                DEFAULT_QUEUE_CONFIG.JOB.ATTEMPTS.toString()
        ),
        backoff: {
            type:
                (configService.get('BACKOFF_TYPE') as BackoffType) ||
                DEFAULT_QUEUE_CONFIG.JOB.BACKOFF.TYPE,
            delay: parseInt(
                configService.get('BACKOFF_DELAY') ||
                    DEFAULT_QUEUE_CONFIG.JOB.BACKOFF.DELAY_MS.toString()
            ),
        },
    },
});