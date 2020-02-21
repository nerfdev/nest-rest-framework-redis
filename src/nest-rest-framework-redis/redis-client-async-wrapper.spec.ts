import { Test, TestingModule } from '@nestjs/testing';
import { RedisClientAsyncWrapper } from './redis-client-async-wrapper';
import { RedisClient } from 'redis';

describe('RedisClientAsyncWrapper', () => {
  let provider: RedisClientAsyncWrapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisClientAsyncWrapper,
        {
          provide: RedisClient,
          useValue: {
            mget: () => null,
          },
        },
      ],
    }).compile();

    provider = module.get<RedisClientAsyncWrapper>(RedisClientAsyncWrapper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
