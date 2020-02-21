import { Test, TestingModule } from '@nestjs/testing';
import {
  RedisRepository,
  EntityPrimaryKeyValueModifier,
} from './redis-repository';
import { RedisClientAsyncWrapper } from './redis-client-async-wrapper';
import { compressData } from './compression-utilities';

class TestType {
  id: string;
  name: string;
  age: number;
}

describe('RedisRepository', () => {
  let subject: RedisRepository;
  let redisWrapper: RedisClientAsyncWrapper;
  let keysMock: jest.SpyInstance<Promise<string[]>, [string]>;
  let getMock: jest.SpyInstance<Promise<string>, [string]>;
  let setMock: jest.SpyInstance<Promise<boolean>, [string, string]>;
  let mgetMock: jest.SpyInstance<Promise<string[]>, [string[]]>;
  let msetMock: jest.SpyInstance<Promise<boolean>, [string[]]>;
  let flushallMock: jest.SpyInstance<Promise<void>, []>;
  let expireMock: jest.SpyInstance<Promise<void>, [string, number]>;
  const primaryKeyPrefix: EntityPrimaryKeyValueModifier<TestType> = 'test_';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisRepository,
        {
          provide: RedisClientAsyncWrapper,
          useValue: {
            keys: () => null,
            get: () => null,
            set: () => null,
            mget: () => null,
            mset: () => null,
            flushall: () => null,
            del: () => null,
            expire: () => null,
          },
        },
      ],
    }).compile();

    subject = module.get<RedisRepository>(RedisRepository);
    redisWrapper = module.get<RedisClientAsyncWrapper>(RedisClientAsyncWrapper);
    keysMock = jest.spyOn(redisWrapper, 'keys');
    getMock = jest.spyOn(redisWrapper, 'get');
    setMock = jest.spyOn(redisWrapper, 'set');
    mgetMock = jest.spyOn(redisWrapper, 'mget');
    msetMock = jest.spyOn(redisWrapper, 'mset');
    flushallMock = jest.spyOn(redisWrapper, 'flushall');
    expireMock = jest.spyOn(redisWrapper, 'expire');
  });

  it('should be defined', () => {
    expect(subject).toBeDefined();
  });

  describe('getAll()', () => {
    it('should get all keys of a type', async () => {
      const obj: TestType = {
        id: '399420892',
        name: 'Ben',
        age: 32,
      };
      const getMockResponse = compressData(JSON.stringify(obj));
      keysMock.mockReturnValue(Promise.resolve(['1']));
      mgetMock.mockReturnValue(Promise.resolve([getMockResponse]));
      const response = await subject.getAll<TestType>(
        TestType,
        primaryKeyPrefix,
      );
      expect(keysMock).toHaveBeenCalledTimes(1);
      expect(mgetMock).toHaveBeenCalledTimes(1);
      expect(mgetMock).toHaveBeenCalledWith(['test_1']);
    });
  });

  describe('save()', () => {
    it('should save', async () => {
      const obj: TestType = {
        id: '399420892',
        name: 'Ben',
        age: 32,
      };
      msetMock.mockReturnValue(Promise.resolve(true));
      await subject.save([obj], 'id', primaryKeyPrefix);
      expect(msetMock).toHaveBeenCalledTimes(1);
      expect(msetMock).toHaveBeenCalledWith([
        `${primaryKeyPrefix}${obj.id}`,
        compressData(obj),
      ]);
    });
  });
});
