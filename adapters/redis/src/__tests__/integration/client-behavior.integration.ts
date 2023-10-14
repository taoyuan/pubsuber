import {Client} from '@pubsuber/core';
import {defineClientBehaviorTests, useRedis} from '@pubsuber/testlab';
import {ChildProcess} from 'child_process';

import {RedisAdapter} from '../../index';

describe('Redis', () => {
  let redis: ChildProcess | undefined;
  let port: number;

  beforeEach(async () => {
    [port, redis] = await useRedis();
  });

  afterEach(() => {
    redis?.kill('SIGINT');
  });

  defineClientBehaviorTests(Client, RedisAdapter, () => port);
});
