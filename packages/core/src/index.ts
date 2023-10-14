import {AdapterClass, AdapterOptions, ClientOptions, ClientState, IAdapter, IClient, Transport} from '@pubsuber/common';
import {Duplex} from 'stream';
import {AnyObj} from 'tily/typings/types';

/**
 * The Client class provides a unified pubsub client in node.js and browsers. It
 * supports subscribing to topics or topic patterns (topics + wildcards). Clients
 * can connect to brokers or bridges that support the client.adapter’s protocol.
 */
export class Client<AO extends AdapterOptions = AdapterOptions> extends Duplex implements IClient<AO> {
  options: ClientOptions & AO;

  adapter: IAdapter;

  transport: Transport;
  incomingQueue: Array<{
    topic: string;
    payload: string | Buffer;
    options?: AnyObj;
  }> = [];

  constructor(options: ClientOptions & AO, adapterClass: AdapterClass<AO>, transport?: Transport) {
    super({
      ...options.stream,
      readableObjectMode: true,
      writableObjectMode: true,
    });

    this.options = options || {};
    this.transport = transport;
    this.adapter = new adapterClass(this);
    this.setMaxListeners(0);

    this.on('message', (topic: string, msg: string | Buffer, opts?: AnyObj) => {
      this.incomingQueue.push({
        topic,
        payload: msg,
        options: opts,
      });
    });
  }

  protected _state: ClientState = null;

  get state() {
    return this._state;
  }

  _read(size: number) {
    while (size--) {
      this.push(this.incomingQueue.shift());
    }
  }

  _write(size: number) {
    while (size--) {
      this.push(this.incomingQueue.shift());
    }
  }

  async connect() {
    if (this._state === 'connected' || this._state === 'connecting') {
      throw new Error('Already connected or connecting');
    }

    this._state = 'connecting';

    try {
      await this.adapter.connect();
      this._state = 'connected';
      this.emit('connect');
    } catch (err) {
      this._state = null;
      throw err;
    }
  }

  end(cb?: (err?: Error) => void) {
    this.close().then(() => cb?.(), cb);
    return this;
  }

  async close() {
    switch (this._state) {
      case 'connected':
      case 'connecting':
        this._state = 'closing';
        await this.adapter.end();
        this._state = 'closed';
    }
  }

  async publish(topic: string, message: string | Buffer, options?: AnyObj) {
    if (!topic || !message) {
      throw new Error('Topic and message are required');
    }

    await this.ready();

    await this.adapter.publish(topic, message, options);
  }

  async subscribe(topic: string, options?: AnyObj) {
    if (!topic) {
      throw new Error('Topic is required');
    }

    await this.ready();

    await this.adapter.subscribe(topic, options);
  }

  async unsubscribe(topic: string) {
    if (!topic) {
      throw new Error('Topic is required');
    }

    await this.ready();

    await this.adapter.unsubscribe(topic);
  }

  async ready() {
    if (this._state === 'connected') {
      return;
    }

    if (this._state === 'connecting') {
      await new Promise(resolve => this.once('connect', resolve));
      return;
    }

    await this.connect();
  }
}
