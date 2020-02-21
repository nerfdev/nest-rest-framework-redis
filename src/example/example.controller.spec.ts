import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './example.controller';
import { ExampleViewSet } from './example-view-set';
import { ExampleModel } from './example-model';

describe('Example Controller', () => {
  let controller: ExampleController;
  let viewSet: ExampleViewSet;
  let createMock: jest.SpyInstance<Promise<ExampleModel>, [ExampleModel]>;
  let retrieveMock: jest.SpyInstance<Promise<ExampleModel>, [string]>;
  let replaceMock: jest.SpyInstance<
    Promise<ExampleModel>,
    [string, ExampleModel]
  >;
  let modifyMock: jest.SpyInstance<
    Promise<ExampleModel>,
    [string, ExampleModel]
  >;
  let destroyMock: jest.SpyInstance<Promise<void>, [string]>;
  const keyPrefix = 'example_';
  const exampleModel: ExampleModel = {
    id: '3910843fjkls',
    lastName: 'Doe',
    firstName: 'Ben',
    age: 32,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
      providers: [
        {
          provide: ExampleViewSet,
          useValue: {
            query: () => null,
            create: () => null,
            retrieve: () => null,
            replace: () => null,
            modify: () => null,
            destroy: () => null,
          },
        },
      ],
    }).compile();

    controller = module.get<ExampleController>(ExampleController);
    viewSet = module.get<ExampleViewSet>(ExampleViewSet);
    createMock = jest.spyOn(viewSet, 'create');
    retrieveMock = jest.spyOn(viewSet, 'retrieve');
    replaceMock = jest.spyOn(viewSet, 'replace');
    modifyMock = jest.spyOn(viewSet, 'modify');
    destroyMock = jest.spyOn(viewSet, 'destroy');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('post()', () => {
    it('should post', async () => {
      createMock.mockReturnValue(Promise.resolve(exampleModel));
      const response = await controller.post(exampleModel, {});
      expect(response).toEqual(exampleModel);
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(createMock).toHaveBeenCalledWith(exampleModel);
    });
  });
  describe('getOne()', () => {
    it('should getOne', async () => {
      retrieveMock.mockReturnValue(Promise.resolve(exampleModel));
      const response = await controller.getOne(exampleModel.id, {});
      expect(response).toEqual(exampleModel);
      expect(retrieveMock).toHaveBeenCalledTimes(1);
      expect(retrieveMock).toHaveBeenCalledWith(exampleModel.id);
    });
  });
  describe('put()', () => {
    it('should put', async () => {
      replaceMock.mockReturnValue(Promise.resolve(exampleModel));
      const response = await controller.put(exampleModel.id, exampleModel, {});
      expect(response).toEqual(exampleModel);
      expect(replaceMock).toHaveBeenCalledTimes(1);
      expect(replaceMock).toHaveBeenCalledWith(exampleModel.id, exampleModel);
    });
  });
  describe('patch()', () => {
    it('should patch', async () => {
      modifyMock.mockReturnValue(Promise.resolve(exampleModel));
      const response = await controller.patch(
        exampleModel.id,
        exampleModel,
        {},
      );
      expect(response).toEqual(exampleModel);
      expect(modifyMock).toHaveBeenCalledTimes(1);
      expect(modifyMock).toHaveBeenCalledWith(exampleModel.id, exampleModel);
    });
  });
  describe('delete()', () => {
    it('should delete', async () => {
      destroyMock.mockReturnValue(Promise.resolve());
      await controller.delete(exampleModel.id, {});
      expect(destroyMock).toHaveBeenCalledTimes(1);
      expect(destroyMock).toHaveBeenCalledWith(exampleModel.id);
    });
  });
});
