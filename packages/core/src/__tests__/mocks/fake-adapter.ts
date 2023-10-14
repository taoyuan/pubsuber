import {IAdapter, IClient, Options} from '@pubsuber/common';
import * as Buffer from 'buffer';
import EventEmitter from 'events';

const EE = new EventEmitter();

export class FakeAdapter implements IAdapter {
  static protocol = 'fake';

  constructor(public client: IClient) {
    EE.on('pubsub_message', (topic: string, message: string | Buffer, options) => {
      client.emit('message', topic, message, options);
    });
  }

  connect(): Promise<void> {
    return Promise.resolve();
  }

  end(): Promise<void> {
    return Promise.resolve();
  }

  async publish(topic: string, message: string | Buffer, options?: Options): Promise<void> {
    process.nextTick(() => {
      EE.emit('pubsub_message', topic, message, options);
    });
  }

  subscribe(topic: string, options?: Options): Promise<void> {
    return Promise.resolve();
  }

  unsubscribe(topic: string): Promise<void> {
    return Promise.resolve();
  }
}
