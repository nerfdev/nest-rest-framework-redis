import { ViewSetBatch, BatchUpdate } from 'nest-rest-framework';
import { Logger } from '@nestjs/common';
import {
  RedisRepository,
  NewEntityConstructor,
  EntityPrimaryKeyPropertyName,
  EntityPrimaryKeyValueModifier,
} from './redis-repository';

export class RedisViewSetBatch<DataT> extends ViewSetBatch<string, DataT> {
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
    this.logger = new Logger(RedisViewSetBatch.name);
  }
  async batchCreate(data: DataT[]): Promise<DataT[]> {
    await this.redisRepository.save(
      data,
      this.primaryKeyPropertyName,
      this.primaryKeyValuePrefix,
    );
    return data;
  }

  async batchRetrieve(pks: string[]): Promise<DataT[]> {
    return await this.redisRepository.get(
      pks,
      this.entityConstructor,
      this.primaryKeyValuePrefix,
    );
  }

  async batchReplace(updates: BatchUpdate<string, DataT>): Promise<DataT[]> {
    const data = updates.map(x => x.data);
    await this.redisRepository.save(
      data,
      this.primaryKeyPropertyName,
      this.primaryKeyValuePrefix,
    );
    return data;
  }

  async batchModify(updates: BatchUpdate<string, DataT>): Promise<DataT[]> {
    const data = updates.map(x => x.data);
    await this.redisRepository.save(
      data,
      this.primaryKeyPropertyName,
      this.primaryKeyValuePrefix,
    );
    return data;
  }

  async batchDestroy(pks: string[]): Promise<void> {
    await this.redisRepository.delete(pks, this.primaryKeyValuePrefix);
  }
}
