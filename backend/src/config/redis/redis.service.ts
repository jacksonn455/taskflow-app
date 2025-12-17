import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { NewRelicService } from '../newrelic/new-relic.service';

@Injectable()
export class RedisService
  implements OnModuleInit, OnModuleDestroy
{
  private client: Redis;

  constructor(private readonly newRelic: NewRelicService) {}

  onModuleInit() {
    const host = process.env.REDIS_HOST;
    const port = Number(process.env.REDIS_PORT || 6379);
    const password = process.env.REDIS_PASSWORD || undefined;
    const db = Number(process.env.REDIS_DB || 0);

    if (!host) {
      console.log('Redis host not configured');
      return;
    }

    try {
      this.client = new Redis({
        host,
        port,
        password,
        db,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: false,
      });

      this.client.on('connect', () => {
        console.log('Redis connected');
        this.newRelic.recordEvent('RedisConnected', {
          host,
          port,
          db,
        });
      });

      this.client.on('error', (error) => {
        this.newRelic.noticeError(error, {
          host,
          port,
          db,
        });
      });
    } catch (error) {
      this.newRelic.noticeError(error);
      throw error;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const start = Date.now();

    try {
      const value = await this.client.get(key);

      this.newRelic.recordMetric(
        'Redis/Get/Duration',
        Date.now() - start,
      );

      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      this.newRelic.noticeError(error, { key });
      throw error;
    }
  }

  async set(
    key: string,
    value: any,
    ttlSeconds?: number,
  ): Promise<void> {
    const start = Date.now();

    try {
      const payload = JSON.stringify(value);

      if (ttlSeconds) {
        await this.client.set(key, payload, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, payload);
      }

      this.newRelic.recordMetric(
        'Redis/Set/Duration',
        Date.now() - start,
      );
    } catch (error) {
      this.newRelic.noticeError(error, { key });
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    const start = Date.now();

    try {
      await this.client.del(key);

      this.newRelic.recordMetric(
        'Redis/Del/Duration',
        Date.now() - start,
      );
    } catch (error) {
      this.newRelic.noticeError(error, { key });
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }
}
