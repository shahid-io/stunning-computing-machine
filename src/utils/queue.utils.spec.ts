import { DEFAULT_QUEUE_CONFIG, getQueueConfig, REDIS_CONFIG } from './queue.utils';

describe('Queue Utils', () => {
  describe('DEFAULT_QUEUE_CONFIG', () => {
    it('should have correct default limiter configuration', () => {
      expect(DEFAULT_QUEUE_CONFIG.LIMITER.MAX).toBe(5);
      expect(DEFAULT_QUEUE_CONFIG.LIMITER.DURATION_MS).toBe(60 * 1000);
    });

    it('should have correct default job configuration', () => {
      expect(DEFAULT_QUEUE_CONFIG.JOB.ATTEMPTS).toBe(3);
      expect(DEFAULT_QUEUE_CONFIG.JOB.BACKOFF.TYPE).toBe('exponential');
      expect(DEFAULT_QUEUE_CONFIG.JOB.BACKOFF.DELAY_MS).toBe(1000);
    });
  });

  describe('REDIS_CONFIG', () => {
    it('should have correct default Redis configuration', () => {
      expect(REDIS_CONFIG.HOST).toBe('localhost');
      expect(REDIS_CONFIG.PORT).toBe(6379);
      expect(REDIS_CONFIG.PASSWORD).toBeUndefined();
    });
  });

  describe('getQueueConfig', () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    it('should return default configuration when no environment variables are set', () => {
      mockConfigService.get.mockReturnValue(undefined);

      const config = getQueueConfig(mockConfigService);

      expect(config.limiter.max).toBe(DEFAULT_QUEUE_CONFIG.LIMITER.MAX);
      expect(config.limiter.duration).toBe(DEFAULT_QUEUE_CONFIG.LIMITER.DURATION_MS);
      expect(config.defaultJobOptions.attempts).toBe(DEFAULT_QUEUE_CONFIG.JOB.ATTEMPTS);
      expect(config.defaultJobOptions.backoff.type).toBe(DEFAULT_QUEUE_CONFIG.JOB.BACKOFF.TYPE);
      expect(config.defaultJobOptions.backoff.delay).toBe(DEFAULT_QUEUE_CONFIG.JOB.BACKOFF.DELAY_MS);
      expect(config.redis.host).toBe(REDIS_CONFIG.HOST);
      expect(config.redis.port).toBe(REDIS_CONFIG.PORT);
      expect(config.redis.password).toBe(REDIS_CONFIG.PASSWORD);
    });

    it('should override configuration with environment variables', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        const env = {
          RATE_LIMIT: '10',
          RATE_LIMIT_WINDOW: '120000',
          QUEUE_ATTEMPTS: '5',
          BACKOFF_TYPE: 'fixed',
          BACKOFF_DELAY: '2000',
          REDISHOST: 'custom-host',
          REDISPORT: '6380',
          REDISPASSWORD: 'custom-password',
        };
        return env[key];
      });

      const config = getQueueConfig(mockConfigService);

      expect(config.limiter.max).toBe(10);
      expect(config.limiter.duration).toBe(120000);
      expect(config.defaultJobOptions.attempts).toBe(5);
      expect(config.defaultJobOptions.backoff.type).toBe('fixed');
      expect(config.defaultJobOptions.backoff.delay).toBe(2000);
      expect(config.redis.host).toBe('custom-host');
      expect(config.redis.port).toBe(6380);
      expect(config.redis.password).toBe('custom-password');
    });
  });
});
