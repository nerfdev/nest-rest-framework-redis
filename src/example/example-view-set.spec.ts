import { Test, TestingModule } from '@nestjs/testing';
import { ExampleViewSet } from './example-view-set';
import {
  RedisRepository,
  NewEntityConstructor,
  EntityPrimaryKeyValueModifier,
} from '../nest-rest-framework-redis';
import { ExampleModel } from './example-model';

describe('ExampleViewSet', () => {
  let provider: ExampleViewSet;
  let redisRepo: RedisRepository;
  let getAllMock: jest.SpyInstance<
    Promise<unknown[]>,
    [NewEntityConstructor<unknown>, EntityPrimaryKeyValueModifier<any>?]
  >;
  let getMock: jest.SpyInstance<
    Promise<unknown[]>,
    [
      string[],
      NewEntityConstructor<unknown>,
      EntityPrimaryKeyValueModifier<any>?,
    ]
  >;
  let saveMock: jest.SpyInstance<
    Promise<void>,
    [unknown[], (data: unknown) => never, EntityPrimaryKeyValueModifier<any>?]
  >;
  let getAllKeysMock: jest.SpyInstance<
    Promise<string[]>,
    [EntityPrimaryKeyValueModifier<any>]
  >;
  let deleteMock: jest.SpyInstance<
    Promise<void>,
    [string[], EntityPrimaryKeyValueModifier<any>?]
  >;
  const keyPrefix = 'example_';
  const exampleModel: ExampleModel = {
    id: '3910843fjkls',
    lastName: 'Doe',
    firstName: 'Ben',
    age: 32,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleViewSet,
        {
          provide: RedisRepository,
          useValue: {
            getAll: () => null,
            get: () => null,
            save: () => null,
            getAllKeys: () => null,
            delete: () => null,
          },
        },
      ],
    }).compile();

    provider = module.get<ExampleViewSet>(ExampleViewSet);
    redisRepo = module.get<RedisRepository>(RedisRepository);
    getAllMock = jest.spyOn(redisRepo, 'getAll');
    getMock = jest.spyOn(redisRepo, 'get');
    saveMock = jest.spyOn(redisRepo, 'save');
    getAllKeysMock = jest.spyOn(redisRepo, 'getAllKeys');
    deleteMock = jest.spyOn(redisRepo, 'delete');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('create()', () => {
    it('should create', async () => {
      saveMock.mockReturnValue(Promise.resolve());
      const response = await provider.create(exampleModel);
      expect(response).toEqual(exampleModel);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith([exampleModel], 'id', keyPrefix);
    });
  });
  describe('retrieve()', () => {
    it('should retrieve', async () => {
      getMock.mockReturnValue(Promise.resolve([exampleModel]));
      const response = await provider.retrieve(exampleModel.id);
      expect(response).toEqual(exampleModel);
      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toBeCalledWith(
        [exampleModel.id],
        ExampleModel,
        keyPrefix,
      );
    });
  });

  describe('replace()', () => {
    it('should replace', async () => {
      saveMock.mockReturnValue(Promise.resolve());
      const response = await provider.replace(exampleModel.id, exampleModel);
      expect(response).toEqual(exampleModel);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith([exampleModel], 'id', keyPrefix);
    });
  });

  describe('modify()', () => {
    it('should modify', async () => {
      saveMock.mockReturnValue(Promise.resolve());
      const response = await provider.modify(exampleModel.id, exampleModel);
      expect(response).toEqual(exampleModel);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith([exampleModel], 'id', keyPrefix);
    });
  });

  describe('destroy()', () => {
    it('should destroy', async () => {
      saveMock.mockReturnValue(Promise.resolve());
      await provider.destroy(exampleModel.id);
      expect(deleteMock).toHaveBeenCalledTimes(1);
      expect(deleteMock).toHaveBeenCalledWith([exampleModel.id], keyPrefix);
    });
  });
});
