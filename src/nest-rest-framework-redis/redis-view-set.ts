import { ViewSet, ViewSetQuery } from 'nest-rest-framework';
import {
  RedisRepository,
  EntityPrimaryKeyPropertyName,
  EntityPrimaryKeyValueModifier,
  NewEntityConstructor,
} from './redis-repository';
import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';

export abstract class RedisViewSet<DataT> extends ViewSet<string, DataT> {
  private readonly logger: Logger;
  constructor(
    protected readonly redisRepository: RedisRepository,
    protected readonly entityConstructor: NewEntityConstructor<DataT>,
    protected readonly primaryKeyPropertyName: EntityPrimaryKeyPropertyName<
      DataT
    >,
    protected readonly primaryKeyValuePrefix: EntityPrimaryKeyValueModifier<
      DataT
    >,
  ) {
    super();
    this.logger = new Logger(RedisViewSet.name);
  }

  async query(query?: ViewSetQuery): Promise<DataT[]> {
    const message = 'Redis does not allow Queries. It is a key-value store!!';
    this.logger.error(message);
    throw new BadRequestException(message);
  }

  async create(data: DataT): Promise<DataT> {
    await this.redisRepository.save(
      [data],
      this.primaryKeyPropertyName,
      this.primaryKeyValuePrefix,
    );
    return data;
  }

  async retrieve(pk: string): Promise<DataT> {
    const response = await this.redisRepository.get(
      [pk],
      this.entityConstructor,
      this.primaryKeyValuePrefix,
    );
    if (!!response && response.length > 0) {
      return response[0];
    }
    throw new NotFoundException(
      `Unable to find key ${pk} for type ${this.primaryKeyValuePrefix}`,
    );
  }

  async replace(pk: string, data: DataT): Promise<DataT> {
    await this.redisRepository.save(
      [data],
      this.primaryKeyPropertyName,
      this.primaryKeyValuePrefix,
    );
    return data;
  }
  async modify(pk: string, data: DataT): Promise<DataT> {
    await this.redisRepository.save(
      [data],
      this.primaryKeyPropertyName,
      this.primaryKeyValuePrefix,
    );
    return data;
  }

  async destroy(pk: string): Promise<void> {
    await this.redisRepository.delete([pk], this.primaryKeyValuePrefix);
  }
}
