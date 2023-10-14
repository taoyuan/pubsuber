// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: strong-pubsub-redis
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {IAdapter, IClient} from '@pubsuber/common';
import debugFactory from 'debug';
import {EventEmitter} from 'events';
import {createClient, RedisClientOptions} from 'redis';

const debug = debugFactory('pubsuber:redis');

/**
 * The **Redis** `Adapter`.
 *
 * @class
 */
export class RedisAdapter extends EventEmitter implements IAdapter {
  static protocol = 'redis';

  client: IClient<RedisClientOptions>;
  options: IClient<RedisClientOptions>['options'];
  redisPubClient: ReturnType<typeof createClient>;
  redisSubClient: ReturnType<typeof createClient>;
  clients: EventEmitter;

  constructor(client: IClient<RedisClientOptions>) {
    super();
    this.client = client;
    this.options = client.options;
  }

  async connect() {
    this.redisPubClient = createClient(this.options);
    this.redisSubClient = createClient(this.options);

    let connacks = 0;
    const clients = (this.clients = new EventEmitter());

    this.redisSubClient.once('connect', onConnect);
    this.redisPubClient.once('connect', onConnect);
    this.redisPubClient.on('error', clients.emit.bind(clients, 'error'));
    this.redisSubClient.on('error', clients.emit.bind(clients, 'error'));

    // this.redisSubClient.on('message', (topic, message, options) => {
    //   this.client.emit('message', topic, message, options);
    // });

    function onConnect() {
      connacks++;
      debug('check connected for connack', connacks);
      if (connacks === 2) {
        debug('connected');
        clients.emit('connect');
      }
    }

    const p = new Promise<void>((resolve, reject) => {
      this.clients.once('connect', () => {
        this.clients.removeListener('error', reject);
        resolve();
      });

      this.clients.once('error', err => reject(err));
    });

    await Promise.all([this.redisPubClient.connect(), this.redisSubClient.connect(), p]);
  }

  async end() {
    await this.redisPubClient.disconnect();
    await this.redisSubClient.disconnect();
  }

  async publish(topic: string, message: string | Buffer) {
    await this.redisPubClient.publish(topic, message);
  }

  async subscribe(topic: string) {
    await this.redisSubClient.subscribe(topic, (message, channel) => {
      this.client.emit('message', channel, message);
    });
  }

  async unsubscribe(topic: string) {
    return this.redisSubClient.unsubscribe(topic);
  }
}
