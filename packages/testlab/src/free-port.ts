import net from 'net';

let portRange = 9000;

export async function getFreePort(): Promise<number> {
  const port = portRange;
  portRange += 1;

  const server = net.createServer();

  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(port, resolve);
    });

    await new Promise<void>(resolve => {
      server.once('close', resolve);
      server.close();
    });

    return port;
  } catch (err) {
    return await getFreePort();
  }
}
