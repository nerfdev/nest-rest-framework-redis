import { Module, Global, DynamicModule } from '@nestjs/common';
import { RedisClientAsyncWrapper } from './redis-client-async-wrapper';
import { RedisRepository } from './redis-repository';
import { ClientOpts, RedisClient } from 'redis';
import { RedisClient as MockRedisClient } from 'redis-mock';

@Global()
@Module({
  providers: [RedisClientAsyncWrapper, RedisRepository],
  exports: [RedisRepository],
})
export class NestRestFrameworkRedisModule {
  static forRoot(
    clientOptions: ClientOpts,
    useMock: boolean = false,
  ): DynamicModule {
    return {
      module: NestRestFrameworkRedisModule,
      providers: [
        RedisClientAsyncWrapper,
        RedisRepository,
        {
          provide: RedisClient,
          useFactory: () => {
            if (!useMock) {
              return new RedisClient(clientOptions);
            }
            return new MockRedisClient(clientOptions);
          },
        },
      ],
      exports: [RedisRepository],
    };
  }
}
