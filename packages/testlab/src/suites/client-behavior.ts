import {AdapterClass, AdapterOptions, ClientClass, IClient} from '@pubsuber/common';

export interface AdapterOptionsWithPort extends AdapterOptions {
  port: number;
}

export function defineClientBehaviorTests(
  clientClass: ClientClass,
  adapterClass: AdapterClass,
  getPort: () => Promise<number> | number,
  options?: AdapterOptions,
) {
  describe('given an external broker server', () => {
    let url: string;
    let topic: string;
    let peer: IClient;
    let publishedMsg: string;
    let receivedMsg: string;

    beforeEach(async () => {
      const port = await getPort();
      url = `${adapterClass.protocol}://localhost:${port}`;
    });

    describe('when a peer is subscribed', () => {
      beforeEach(async () => {
        topic = 'my test topic';
        peer = new clientClass({url, ...options}, adapterClass);
        await peer.subscribe(topic);
      });

      afterEach(async () => {
        await peer.close();
      });

      describe('when a client publishes a message', () => {
        let client: IClient;

        beforeEach(async () => {
          client = new clientClass({url, ...options}, adapterClass);
        });

        afterEach(async () => {
          await client.close();
        });

        it('should be received by the subscriber', async () => {
          publishedMsg = 'my test message';
          await client.publish(topic, publishedMsg);
          await new Promise<void>(resolve => {
            peer.on<string>('message', (_, msg) => {
              receivedMsg = msg;
              resolve();
            });
          });
          expect(publishedMsg).toEqual(receivedMsg.toString());
        });
      });
    });
  });
}
