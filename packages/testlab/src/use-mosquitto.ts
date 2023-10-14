import {ChildProcess} from 'child_process';

import {getFreePort} from './free-port';
import {startMosquitto} from './mosquitto';
import {waitForConnection} from './wait-for-connection';

export async function startMosquittoServer(): Promise<[number, ChildProcess]> {
  const port = await getFreePort();

  const mosquitto = startMosquitto(port);

  await waitForConnection(port);
  return [port, mosquitto];
}
