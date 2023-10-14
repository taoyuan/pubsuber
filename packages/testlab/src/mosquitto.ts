import {CommonSpawnOptions, spawn} from 'child_process';
import debug from 'debug';

// const SANDBOX = path.join('..', __dirname, 'sandbox');

export function startMosquitto(port: number) {
  const options: CommonSpawnOptions = {};

  if (debug.enabled('pubsuber:testlab')) {
    options.stdio = ['ignore', process.stdout, process.stderr];
  }

  return spawn('mosquitto', ['-p', port.toString(), '-v'], options);
}
