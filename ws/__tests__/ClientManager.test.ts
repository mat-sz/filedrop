import { v4 as uuid } from 'uuid';

import { ClientManager } from '../src/ClientManager';
import { Client } from '../src/types/Client';
import { generateClientName } from '../src/utils/name';
import { MessageType, ActionMessageActionType } from '../src/types/MessageType';
import { TargetedMessageModel, ActionMessageModel } from '../src/types/Models';

export class TestClient implements Client {
  readonly clientId = uuid();
  clientName = generateClientName();
  readonly firstSeen = new Date();
  lastSeen = new Date();
  remoteAddress?: string = undefined;
  networkName?: string = undefined;
  lastMessage = '{}';
  closed = false;
  readyState = 1;

  send(data: string) {
    this.lastMessage = data;
  }

  close() {
    this.closed = true;
  }
}

describe('ClientManager', () => {
  it('welcomes the client', async () => {
    const clientManager = new ClientManager();

    const client = new TestClient();
    clientManager.addClient(client);

    expect(JSON.parse(client.lastMessage)).toMatchObject({
      type: MessageType.WELCOME,
      clientId: client.clientId,
      suggestedClientName: client.clientName,
    });
  });

  it('keeps track of local clients', async () => {
    const clientManager = new ClientManager();

    const client1 = new TestClient();
    client1.remoteAddress = '127.0.0.1';
    client1.networkName = 'TEST';
    clientManager.addClient(client1);

    const client2 = new TestClient();
    client2.remoteAddress = '127.0.0.2';
    client2.networkName = 'TEST';
    clientManager.addClient(client2);

    const client3 = new TestClient();
    client3.remoteAddress = '127.0.0.1';
    client3.networkName = 'TEST';
    clientManager.addClient(client3);

    expect(clientManager.getLocalClients(client1)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clientId: client1.clientId,
        }),
        expect.objectContaining({
          clientId: client3.clientId,
        }),
      ])
    );
    expect(clientManager.getLocalClients(client2)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clientId: client2.clientId,
        }),
      ])
    );

    clientManager.removeClient(client3);
    expect(clientManager.getLocalClients(client1)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clientId: client1.clientId,
        }),
      ])
    );
  });

  it('pings clients', async () => {
    const clientManager = new ClientManager();

    const client1 = new TestClient();
    clientManager.addClient(client1);

    const client2 = new TestClient();
    clientManager.addClient(client2);

    const client3 = new TestClient();
    clientManager.addClient(client3);

    clientManager.pingClients();

    expect(JSON.parse(client1.lastMessage)).toMatchObject({
      type: MessageType.PING,
    });

    expect(JSON.parse(client2.lastMessage)).toMatchObject({
      type: MessageType.PING,
    });

    expect(JSON.parse(client3.lastMessage)).toMatchObject({
      type: MessageType.PING,
    });
  });

  it('relays messages to target clients', async () => {
    const clientManager = new ClientManager();

    const client1 = new TestClient();
    clientManager.addClient(client1);

    const client2 = new TestClient();
    clientManager.addClient(client2);

    const targetedMessage: ActionMessageModel = {
      type: MessageType.ACTION,
      action: ActionMessageActionType.ACCEPT,
      targetId: client2.clientId,
      transferId: uuid(),
    };

    clientManager.handleMessage(client1, targetedMessage);

    expect(JSON.parse(client2.lastMessage)).toMatchObject({
      type: MessageType.ACTION,
    });
  });

  it('drops invalid messages', async () => {
    const clientManager = new ClientManager();

    const client1 = new TestClient();
    clientManager.addClient(client1);

    const client2 = new TestClient();
    clientManager.addClient(client2);

    const targetedMessage: TargetedMessageModel = {
      type: MessageType.ACTION,
      targetId: client2.clientId,
    };

    clientManager.handleMessage(client1, targetedMessage);

    expect(JSON.parse(client2.lastMessage)).toMatchObject({
      type: MessageType.WELCOME,
    });
  });
});
