import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGO_DB || 'my_database';

    this.client = new MongoClient(uri);
    await this.client.connect();

    this.db = this.client.db(dbName);

    console.log('MongoDB connected');
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('MongoDB not initialized');
    }
    return this.db;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB is disconnected');
    }
  }
}
