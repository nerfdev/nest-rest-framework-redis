<p align="center">
  <a href="http://redis.io/" target="blank"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQZo5CrDo2T0CEw8ZdW2uH6mO2GjND8GyGHzJQJ-Tu2tHtGI0oM" width="200" alt="Nest Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="200" alt="Nest Logo" /></a>

</p>

[![CircleCI](https://circleci.com/gh/benMain/nest-rest-framework-redis.svg?style=svg)](https://circleci.com/gh/benMain/nest-rest-framework-redis)



## Description

Nest-Rest-Framework-Redis manages your REDIS CRUD for you.  Need a super fast Key-Value store for some of your data, but don't want to sacrficie REST conventions? Try our framework

## Installation

```bash
$ npm install --save nest-rest-framework nest-rest-framework-redis
```

## Usage

See the example Directory. 

Like All Nest Rest Framework implementations, you start with a model. 
```typescript
export class ExampleModel {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}
```


Then you define a ViewSet that Extends [RedisViewSet](./src/nest-rest-framework-redis/redis-view-set.ts).  The Class should be injectible. 
The redisRepository injected will be provided by a Global Export from the NestRestFrameworkRedisModule. 
The second argument is the type you want to save. 
The third argument is the property inside that object represeting the Key, redis is a key/value store. This can also be a function which return a string.
The final argument is a prefix to use for the Type. If you want to colocate multiple types in one redis cluster then using a prefix specific to each type helps

```typescript
import { Injectable } from '@nestjs/common';
import { RedisViewSet, RedisRepository } from 'nest-rest-framework-redis';
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

```

Then you define a controller that injects that ViewSet. It needs to be decorated as a controller. You can review the other options which can be injected into the RestController. They essentially allow you to do any business logic necessary at all points of the request lifecycle. 

```typescript
import { Controller } from '@nestjs/common';
import { RestController } from 'nest-rest-framework';
import { ExampleModel } from './example-model';
import { ExampleViewSet } from './example-view-set';

@Controller('example')
export class ExampleController extends RestController<
  string,
  ExampleModel,
  ExampleModel,
  ExampleModel
> {
  constructor(readonly exampleViewSet: ExampleViewSet) {
    super({
      viewset: exampleViewSet,
    });
  }
}

```

Finally import NestRestFrameworkRedisModule in your app module. It will provide the RedisRepository you need. 
The forRoot method takes  ClientOps arguments from the node redis lib. The second argument is whether you want to run a local in-memroy mock-redis server for testing. We found the library very, very useful. 

```typescript
import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleViewSet } from './example-view-set';
import { NestRestFrameworkRedisModule } from 'nest-rest-framework-redis';

@Module({
  imports: [
    NestRestFrameworkRedisModule.forRoot(
      {
        host: 'localhost',
        port: 66666,
        password: 'fakepassword',
      },
      true,
    ),
  ],
  controllers: [ExampleController],
  providers: [ExampleViewSet],
})
export class ExampleModule {}

```
## Stay in touch

- Author - [Benjamin Main](mailto::bam036036@gmail.com)


## License

  Nest-Rest-Framework-Redis is [MIT licensed](LICENSE).
