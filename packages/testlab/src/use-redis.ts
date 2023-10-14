import {ChildProcess} from 'child_process';

import {getFreePort} from './free-port';
import {startRedis} from './redis';
import {waitForConnection} from './wait-for-connection';

export async function useRedis(): Promise<[number, ChildProcess]> {
  const port = await getFreePort();
  const redis = startRedis(port);
  await waitForConnection(port);
  return [port, redis];
}
