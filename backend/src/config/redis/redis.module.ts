import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { NewRelicModule } from '../newrelic/new-relic.module';

@Module({
  imports: [NewRelicModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
