import { Module } from '@nestjs/common';
import { MongoService } from '../mongodb/mongo.service';

@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
