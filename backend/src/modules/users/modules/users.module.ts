// src/modules/users/modules/users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { UsersController } from '../controllers/user.controller';
import { MongoModule } from '../../../config/mongodb/mongo.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongoModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
