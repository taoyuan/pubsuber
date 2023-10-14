# strong-pubsub-redis

\*\*[Redis](http://redis.io/) `Adapter` for pubsuber

## Installation

```
$ npm install @pubsuber/redis
```

## Usage

```ts
import {Client} from '@pubsuber/core';
import {RedisAdapter} from '@pubsuber/redis';

const client = new Client({url: 'redis://my.message-broker.com:3000'}, RedisAdapter);

client.publish('my topic', 'my message');
```
