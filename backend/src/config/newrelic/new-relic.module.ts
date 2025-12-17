import { Module } from '@nestjs/common';
import { NewRelicService } from './new-relic.service';

@Module({
  providers: [NewRelicService],
  exports: [NewRelicService],
})
export class NewRelicModule {}
