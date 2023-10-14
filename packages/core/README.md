# @pubsuber/core

> The core module of pubsuber

```
$ npm install @pubsuber/core
```

## Usage

**NOTE: until version `1.0.0` the API may change!**

```ts
import {Client} from '@pubsuber/core';
import {MqttAdapter} from '@pubsuber/mqtt';

// two clients connecting to the same broker
const siskel = new Client({url: 'mqtt://my.message-broker.com:3000'}, MqttAdapter);
const ebert = new Client({url: 'mqtt://my.message-broker.com:3000'}, MqttAdapter);

siskel.subscribe('movies');
siskel.on('message', function (topic, msg) {
  console.log(topic, msg.toString()); // => movies birdman
});

ebert.publish('movies', 'birdman');
```

## Client (pubsuber)

The `Client` class provides a unified pubsub client in Node.js and browsers. It supports subscribing to topics or topic
patterns (topics and wildcards). Clients can connect to brokers or bridges that support the `client.adapter`’s protocol.

## Adapter

Client adapters implement the `Client` API in a broker protocol-specific way.

Specify the adapter specific options using the name as the key.

```js
{
  mqtt: {
    clientId: 'foobar';
  }
}
```

### Protocols

`pubsuber` supports these two protocols:

- [MQTT](http://mqtt.org/)
- [STOMP](https://stomp.github.io/)

It is possible to extend **pubsuber** to support other protocols, but that is beyond the scope of this README.

## Modules / Plugins

- @pubsuber/bridge - TBD
- [@pubsuber/redis](https://github.com/betaly/pubsuber/tree/master/packages/redis) - **Redis** `Adapter` for pubsuber
- @pubsuber/mqtt - TBD
- @pubsuber/connection-mqtt - TBD
