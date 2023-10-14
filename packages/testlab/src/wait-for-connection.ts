import net from 'net';

export async function waitForConnection(port: number): Promise<void> {
  try {
    const connection = net.createConnection(port);

    await new Promise<void>((resolve, reject) => {
      connection.once('error', reject);
      connection.once('connect', resolve);
    });
  } catch (error) {
    await waitForConnection(port);
  }
}
