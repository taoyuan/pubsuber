import {CommonSpawnOptions, spawn} from 'child_process';
import debug from 'debug';

// const SANDBOX = path.join('..', __dirname, 'sandbox');

export function startRedis(port: number) {
  const options: CommonSpawnOptions = {};

  if (debug.enabled('pubsuber:testlab')) {
    options.stdio = ['ignore', process.stdout, process.stderr];
  }

  return spawn('redis-server', ['--port', port.toString(), '--loglevel', 'verbose'], options);
}
