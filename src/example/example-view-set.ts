import { Injectable } from '@nestjs/common';
import { RedisViewSet, RedisRepository } from '../nest-rest-framework-redis';
import { ExampleModel } from './example-model';

@Injectable()
export class ExampleViewSet extends RedisViewSet<ExampleModel> {
  constructor(readonly redisRepository: RedisRepository) {
    super(
      redisRepository, // The Redis Repository
      ExampleModel, // The Example Model you want to svae
      'id', // The property of ExampleModel representing the primaryKey
      'example_', // The Prefix for distinguishing keys of different data types in Redis.
    );
  }
}
