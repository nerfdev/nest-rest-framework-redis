import { Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';

@Injectable()
export class RedisClientAsyncWrapper {
  constructor(private readonly client: RedisClient) {}

  keys(pattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.client.keys(pattern, (err, keys) =>
        err ? reject(err) : resolve(keys),
      );
    });
  }

  get(keys: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client.get(keys, (err, result) =>
        err ? reject(err) : resolve(result),
      );
    });
  }

  set(key: string, value: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.client.set(key, value, err => (err ? reject(err) : resolve()));
    });
  }

  mget(keys: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.client.mget(keys, (err, result) =>
        err ? reject(err) : resolve(result),
      );
    });
  }

  mset(keys: string[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.client.mset(keys, (err, result) =>
        err ? reject(err) : resolve(result),
      );
    });
  }

  flushall(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.flushall(err => (err ? reject(err) : resolve()));
    });
  }

  del(keys: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.del(keys, err => (err ? reject(err) : resolve()));
    });
  }

  expire(key: string, seconds: number) {
    return new Promise<void>((resolve, reject) => {
      this.client.expire(key, seconds, err => (err ? reject(err) : resolve()));
    });
  }
}
