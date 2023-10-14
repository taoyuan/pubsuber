import {defineClientBehaviorTests, getFreePort} from '@pubsuber/testlab';

import {Client} from '../../index';
import {FakeAdapter} from '../mocks/fake-adapter';

describe('Client Behavior', () => {
  defineClientBehaviorTests(Client, FakeAdapter, getFreePort);
});
