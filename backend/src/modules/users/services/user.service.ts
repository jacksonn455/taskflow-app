import { Injectable } from '@nestjs/common';
import { MongoService } from '../../../config/mongodb/mongo.service';
import { User } from '../entities/user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  private readonly collectionName = 'users';

  constructor(private readonly mongoService: MongoService) {}

  private get collection() {
    return this.mongoService.getDb().collection<User>(this.collectionName);
  }

  async create(user: Omit<User, '_id'>): Promise<User> {
    const now = new Date();

    const result = await this.collection.insertOne({
      ...user,
      createdAt: now,
      updatedAt: now,
    });

    return { _id: result.insertedId, ...user };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.collection.findOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async updateLastLogin(userId: ObjectId): Promise<void> {
    await this.collection.updateOne(
      { _id: userId },
      {
        $set: {
          lastLogin: new Date(),
          updatedAt: new Date(),
        },
      },
    );
  }
}
