import {AdapterClass, ClientClass, IClient} from '@pubsuber/common';

export function defineClientTests(
  clientClass: ClientClass,
  adapterClass: AdapterClass,
  getPort: () => Promise<number> | number,
  timeout = 0,
) {
  describe('Client', () => {
    let url: string;

    beforeEach(async () => {
      const port = await getPort();
      url = `${adapterClass.protocol}://localhost:${port}`;
    });

    describe('adapter class', () => {
      it('should have static `protocol` property', () => {
        expect(typeof adapterClass.protocol).toBe('string');
      });
    });

    describe('client.connect(callback)', () => {
      it('Connect to the broker or bridge.', async () => {
        const client = new clientClass({url}, adapterClass);
        await client.connect();
        await client.close();
      }, 10000);
    });

    describe('client with a connection established', () => {
      let topic: string;
      let message: string;
      let client: IClient;

      beforeEach(async () => {
        topic = 'test topic';
        message = 'test message';
        client = new clientClass({url}, adapterClass);
        await client.connect();
      });

      afterEach(async () => {
        await client.close();
      });

      describe('client.publish(topic, message, options, callback)', () => {
        it(
          'Publish a `message` to the specified `topic`',
          async () => {
            await client.publish(topic, message);
          },
          timeout,
        );
      });

      describe('client.subscribe(topic, options, cb', () => {
        it(
          'Subscribe to the specified `topic` or **topic pattern**.',
          async () => {
            await client.subscribe(topic);
          },
          timeout,
        );
      });

      describe('client.unsubscribe(topic, options, cb', () => {
        it(
          'Unsubscribe from the specified `topic` or **topic pattern**.',
          async () => {
            await client.subscribe(topic);
            await client.unsubscribe(topic);
          },
          timeout,
        );
      });
    });
  });
}
