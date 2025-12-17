import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { NewRelicModule } from '../newrelic/new-relic.module';

@Module({
  imports: [NewRelicModule],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
