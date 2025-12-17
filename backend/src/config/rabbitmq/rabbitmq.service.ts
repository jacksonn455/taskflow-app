import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { NewRelicService } from '../newrelic/new-relic.service';

@Injectable()
export class RabbitMQService
  implements OnModuleInit, OnModuleDestroy
{
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly newRelic: NewRelicService) {}

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL;

    if (!url) {
      console.log('RabbitMQ URL not configured');
      return;
    }

    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      console.log('RabbitMQ connected');

      this.newRelic.recordEvent('RabbitMQConnected', {
        url,
      });
    } catch (error) {
      this.newRelic.noticeError(error);
      throw error;
    }
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: unknown,
  ) {
    const start = Date.now();

    try {
      const buffer = Buffer.from(JSON.stringify(message));
      this.channel.publish(exchange, routingKey, buffer);

      this.newRelic.recordMetric(
        'RabbitMQ/Publish/Duration',
        Date.now() - start,
      );
    } catch (error) {
      this.newRelic.noticeError(error, {
        exchange,
        routingKey,
      });
      throw error;
    }
  }

  async consume(
    queue: string,
    onMessage: (msg: amqp.ConsumeMessage) => Promise<void>,
  ) {
    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      const start = Date.now();

      try {
        await onMessage(msg);
        this.channel.ack(msg);

        this.newRelic.recordMetric(
          'RabbitMQ/Consume/Duration',
          Date.now() - start,
        );
      } catch (error) {
        this.newRelic.noticeError(error, { queue });
        this.channel.nack(msg, false, false);
      }
    });
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
