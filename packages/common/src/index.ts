import {Duplex, DuplexOptions} from 'stream';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Options = Record<string, any>;

export interface AdapterOptions {
  url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ClientOptions {
  stream?: DuplexOptions;
}

export type ClientState = 'closed' | 'connecting' | 'connected' | 'closing' | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transport = any;

export interface IAdapter {
  connect(): Promise<void>;

  publish(topic: string, message: string | Buffer, options?: Options): Promise<void>;

  subscribe(topic: string, options?: Options): Promise<void>;

  unsubscribe(topic: string): Promise<void>;

  end(): Promise<void>;
}

export interface IClient<AO extends AdapterOptions = AdapterOptions> extends Duplex {
  readonly options: ClientOptions & AO;
  readonly state: ClientState;
  connect: () => Promise<void>;
  close: () => Promise<void>;
  publish: (topic: string, message: string) => Promise<void>;
  subscribe: (topic: string) => Promise<void>;
  unsubscribe: (topic: string) => Promise<void>;

  on<T>(event: 'message', listener: (topic: string, message: T) => void): this;
  on(event: string, listener: Function): this;
}

export interface AdapterClass<AO extends AdapterOptions = AdapterOptions> {
  protocol: string;
  new (client: IClient<AO>): IAdapter;
}

export interface ClientClass<AO extends AdapterOptions = AdapterOptions> {
  new (options: ClientOptions & AO, AdapterClass: AdapterClass<AO>, transport?: Transport): IClient<AO>;
}
