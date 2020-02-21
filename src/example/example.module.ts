import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleViewSet } from './example-view-set';
import { NestRestFrameworkRedisModule } from '../nest-rest-framework-redis';

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
