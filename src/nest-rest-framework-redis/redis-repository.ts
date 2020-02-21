import { Injectable, Logger } from '@nestjs/common';
import { RedisClientAsyncWrapper } from './redis-client-async-wrapper';
import { compressData, decompressData } from './compression-utilities';

export type NewEntityConstructor<T> = (new () => T) | (() => T);
export type EntityPrimaryKeyPropertyName<T> = keyof T | ((data: T) => keyof T);
export type EntityPrimaryKeyValueModifier<T> =
  | string
  | ((keyValue: any) => string);

@Injectable()
export class RedisRepository {
  private readonly logger: Logger = new Logger(RedisRepository.name);

  constructor(private readonly client: RedisClientAsyncWrapper) {}

  async getAll<T>(
    entityConstructor: NewEntityConstructor<T>,
    primaryKeyPrefix?: EntityPrimaryKeyValueModifier<T>,
  ): Promise<T[]> {
    const keys = await this.getAllKeys(primaryKeyPrefix);
    if (!keys || !keys.length) {
      return [];
    }
    return await this.get(keys, entityConstructor, primaryKeyPrefix);
  }

  async get<T>(
    keys: string[],
    entityConstructor: NewEntityConstructor<T>,
    primaryKeyPrefix?: EntityPrimaryKeyValueModifier<T>,
  ): Promise<T[]> {
    const prefixedKeys = this.prefixPrimaryKeyValues(keys, primaryKeyPrefix);
    const response = await this.client.mget(prefixedKeys);
    return response
      .filter(redisData => !!redisData)
      .map(redisData => {
        try {
          const record = this.buildEntity<T>(entityConstructor);
          const decompressedData = decompressData(redisData);
          return Object.assign(record, decompressedData);
        } catch (ex) {
          this.logger.error(
            `Failed to inflate record ${redisData}: ${JSON.stringify(ex)}`,
          );
          return null;
        }
      })
      .filter(deserializedData => !!deserializedData);
  }

  async save<T>(
    values: T[],
    primaryKeyPropertyName: EntityPrimaryKeyPropertyName<T>,
    primaryKeyPrefix?: EntityPrimaryKeyValueModifier<T>,
  ): Promise<void> {
    const keyValArray = this.createKeyValueArray(
      values,
      primaryKeyPropertyName,
      primaryKeyPrefix,
    );
    const response = await this.client.mset(keyValArray);
    if (!response) {
      throw new Error('Failed to commit redis transaction!');
    }
  }

  async getAllKeys<T>(primaryKeyPrefix: EntityPrimaryKeyValueModifier<T>) {
    const pattern = this.prefixPrimaryKeyValues([''], primaryKeyPrefix).pop();
    return await this.client.keys(pattern);
  }

  async delete<T>(
    keys: string[],
    primaryKeyPrefix?: EntityPrimaryKeyValueModifier<T>,
  ): Promise<void> {
    const prefixedKeys = this.prefixPrimaryKeyValues(keys, primaryKeyPrefix);
    return await this.client.del(prefixedKeys);
  }

  async flush<T>(
    primaryKeyPrefix?: EntityPrimaryKeyValueModifier<T>,
  ): Promise<void> {
    const keys = await this.getAllKeys(primaryKeyPrefix);
    return await this.client.del(keys);
  }

  async expire<T>(
    keys: string[],
    seconds: number,
    primaryKeyPrefix?: EntityPrimaryKeyValueModifier<T>,
  ): Promise<void> {
    const prefixedKeys = this.prefixPrimaryKeyValues(keys, primaryKeyPrefix);

    await Promise.all(
      prefixedKeys.map(key => {
        return this.client.expire(key, seconds);
      }),
    );
  }

  private createKeyValueArray<T>(
    values: T[],
    primaryKeyPropertyName: EntityPrimaryKeyPropertyName<T>,
    primaryKeyPrefix?: EntityPrimaryKeyValueModifier<T>,
  ): string[] {
    const multiList = values.map(x => {
      const recordPrimaryKey =
        typeof primaryKeyPropertyName === 'function'
          ? primaryKeyPropertyName(x)
          : primaryKeyPropertyName;

      const primaryKeyValue = this.prefixPrimaryKeyValues(
        [x[recordPrimaryKey.toString()]],
        primaryKeyPrefix,
      ).pop();

      return [primaryKeyValue, compressData(x)];
    });

    return [].concat.apply([], multiList);
  }

  private prefixPrimaryKeyValues<T>(
    keys: string[],
    primaryKeyPrefix: EntityPrimaryKeyValueModifier<T>,
  ) {
    if (!primaryKeyPrefix) {
      return keys;
    }

    if (typeof primaryKeyPrefix === 'function') {
      return keys.map(primaryKeyPrefix);
    }

    return keys.map(k => `${primaryKeyPrefix}${k}`);
  }

  private buildEntity<T>(entityConstructor: NewEntityConstructor<T>) {
    try {
      // tslint:disable-next-line: new-parens
      const constructorResult = new (entityConstructor as new () => T)();
      return constructorResult;
    } catch {
      // noop
    }

    try {
      // tslint:disable-next-line: new-parens
      const functionResult = (entityConstructor as () => T)();
      return functionResult;
    } catch {
      // noop
    }

    return null;
  }
}
