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
