import {defineClientTests, getFreePort} from '@pubsuber/testlab';

import {Client} from '../../index';
import {FakeAdapter} from '../mocks/fake-adapter';

describe('Client API', () => {
  defineClientTests(Client, FakeAdapter, getFreePort);
});
