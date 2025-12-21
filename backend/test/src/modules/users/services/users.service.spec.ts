import { UsersService } from '../../../../../src/modules/users/services/user.service';
import { MongoService } from '../../../../../src/config/mongodb/mongo.service';
import { ObjectId } from 'mongodb';

describe('UsersService', () => {
  let service: UsersService;

  const collectionMock = {
    insertOne: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  const mongoServiceMock = {
    getDb: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(collectionMock),
    }),
  } as unknown as MongoService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(mongoServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const fakeId = new ObjectId();

    collectionMock.insertOne.mockResolvedValueOnce({
      insertedId: fakeId,
    } as any);

    const user = {
      email: 'test@test.com',
      password: '123456',
    };

    const result = await service.create(user as any);

    expect(collectionMock.insertOne).toHaveBeenCalled();
    expect(result._id).toEqual(fakeId);
    expect(result.email).toBe(user.email);
  });

  it('should find user by email', async () => {
    collectionMock.findOne.mockResolvedValueOnce({
      email: 'test@test.com',
    });

    const result = await service.findByEmail('test@test.com');

    expect(collectionMock.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(result).toBeDefined();
  });

  it('should update last login', async () => {
    const userId = new ObjectId();

    await service.updateLastLogin(userId);

    expect(collectionMock.updateOne).toHaveBeenCalled();
  });
});
