import { Injectable, OnModuleInit } from '@nestjs/common';

let newRelicEnabled = false;

@Injectable()
export class NewRelicService implements OnModuleInit {
  onModuleInit() {
    const enabled = process.env.NEW_RELIC_ENABLED === 'true';
    const licenseKey = process.env.NEW_RELIC_LICENSE_KEY;

    if (!enabled) {
      console.log('New Relic monitoring is disabled');
      return;
    }

    if (!licenseKey) {
      console.log(
        'New Relic license key not found. Monitoring will be disabled.',
      );
      return;
    }

    require('newrelic');

    newRelicEnabled = true;
    console.log('New Relic initialized successfully');
  }

  recordMetric(name: string, value: number): void {
    if (!newRelicEnabled) return;
    const newrelic = require('newrelic');
    newrelic.recordMetric(name, value);
  }

  recordEvent(eventType: string, attributes: Record<string, any>): void {
    if (!newRelicEnabled) return;
    const newrelic = require('newrelic');
    newrelic.recordCustomEvent(eventType, attributes);
  }

  addCustomAttribute(key: string, value: string | number | boolean): void {
    if (!newRelicEnabled) return;
    const newrelic = require('newrelic');
    newrelic.addCustomAttribute(key, value);
  }

  noticeError(error: Error, customAttributes?: Record<string, any>): void {
    if (!newRelicEnabled) return;
    const newrelic = require('newrelic');
    newrelic.noticeError(error, customAttributes);
  }
}
