import { Module } from '@nestjs/common';
import { NewRelicModule } from './config/newrelic/new-relic.module';
import { RabbitMQModule } from './config/rabbitmq/rabbitmq.module';
import { RedisModule } from './config/redis/redis.module';

@Module({
  imports: [NewRelicModule, RabbitMQModule, RedisModule],
})
export class AppModule {}
