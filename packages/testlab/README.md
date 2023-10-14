# @pubsuber/testlab

> This module is a set of utilities for testing other **pubsuber** modules.

## Testing a Client Adapter API

```ts
import {defineClientTests, usingMosquitto} from '@pubsuber/testlab';
import {Client} from '@pubsuber/core';
import {ChildProcess} from 'child_process';

import {MqttAdapter} from '<SomePath>';

describe('MQTT', function () {
  let port: number;
  let process: ChildProcess;
  beforeEach(async () => {
    [port, process] = await usingMosquitto();
  });

  afterEach(() => {
    process.kill();
  });

  defineClientTests(Client, MqttAdapter, () => port);
});
```

## Testing a Client Adapter Behavior

```ts
import {defineClientBehaviorTests, usingMosquitto} from '@pubsuber/testlab';
import {Client} from '@pubsuber/core';
import {ChildProcess} from 'child_process';

import {MqttAdapter} from '<SomePath>';

describe('MQTT', function () {
  let port: number;
  let process: ChildProcess;
  beforeEach(async () => {
    [port, process] = await usingMosquitto();
  });

  afterEach(() => {
    process.kill();
  });

  defineClientBehaviorTests(Client, MqttAdapter, () => port);
});
```
