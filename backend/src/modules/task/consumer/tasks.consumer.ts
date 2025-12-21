import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import * as newrelic from 'newrelic';

@Injectable()
export class TasksConsumer {
  private readonly logger = new Logger(TasksConsumer.name);

  @EventPattern('task.created')
  async handleTaskCreated(@Payload() data: any) {
    this.logger.log(`📝 Task created: ${data.taskId}`);
    this.logger.log(`User: ${data.userId}, Title: ${data.title}`);

    newrelic.recordCustomEvent('TaskCreatedEvent', {
      taskId: data.taskId,
      userId: data.userId,
      timestamp: data.timestamp,
    });
  }

  @EventPattern('task.updated')
  async handleTaskUpdated(@Payload() data: any) {
    this.logger.log(`✏️ Task updated: ${data.taskId}`);
    this.logger.log(`Changes: ${JSON.stringify(data.changes)}`);

    newrelic.recordCustomEvent('TaskUpdatedEvent', {
      taskId: data.taskId,
      userId: data.userId,
      timestamp: data.timestamp,
    });
  }

  @EventPattern('task.completed')
  async handleTaskCompleted(@Payload() data: any) {
    this.logger.log(`🎉 Task completed: ${data.taskId}`);
    this.logger.log(`Title: ${data.title}`);
    this.logger.log(`Completed at: ${data.completedAt}`);

    newrelic.recordCustomEvent('TaskCompletedEvent', {
      taskId: data.taskId,
      userId: data.userId,
      title: data.title,
      completedAt: data.completedAt,
      timestamp: data.timestamp,
    });

    await this.sendCompletionNotification(data.userId, data.taskId, data.title);
  }

  @EventPattern('task.deleted')
  async handleTaskDeleted(@Payload() data: any) {
    this.logger.log(`🗑️ Task deleted: ${data.taskId}`);

    newrelic.recordCustomEvent('TaskDeletedEvent', {
      taskId: data.taskId,
      userId: data.userId,
      timestamp: data.timestamp,
    });
  }

  private async sendCompletionNotification(
    userId: string,
    taskId: string,
    title: string,
  ) {
    this.logger.log(`📧 Sending completion notification to user ${userId}`);
    this.logger.log(`Task: ${title} (${taskId})`);

    return new Promise((resolve) => {
      setTimeout(() => {
        this.logger.log(`✅ Notification sent successfully!`);
        resolve(true);
      }, 1000);
    });
  }
}
