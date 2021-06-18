export class wsClient {
  static client;
  static connectionId;

  static send({ action, value }) {
    if (wsClient.client.readyState === wsClient.client.OPEN) {
      const connId = wsClient.connectionId;
      wsClient.client.send(JSON.stringify({ action, value: { ...value, connectionId: connId } }));
      return true;
    }
    return false
  }

  static parseResponse(response) {
    const { data } = response;
    const message = JSON.parse(data);
    return message;
  }
};

export class wsHandlers {

  static handlers = {};

  static processing = false;

  static setHandler = ({ id, handler }) => {
    wsHandlers.handlers[id] = handler;
  };

  static addHandler = (callback) => {
    let i = 0;
    while (wsHandlers.handlers[i]) i += 1;
    wsHandlers.handlers[i] = callback;
    return i;
  };

  static removeHandler = ({ id }) => {
    delete wsHandlers.handlers[id];
  };

  static handle(message) {
    if (wsHandlers.processing) return;
    wsHandlers.processing = true;
    Object.keys(wsHandlers.handlers).forEach((handlerId) => {
      wsHandlers.handlers[handlerId](message);
    });
    wsHandlers.processing = false;
  }
}

export const initWsClient = () => {
  wsClient.client = new WebSocket('ws://localhost:9000');

  wsHandlers.setHandler({ id: 'CONNECTION.GET_ID', handler: (msg) => {
    const message = wsClient.parseResponse(msg);
    if (message.action === 'SET_CONNECTION_ID') {
      wsClient.connectionId = message.value;
      console.log('CONNECTION ID', wsClient.connectionId);
    }
  }});

  wsClient.client.onmessage = function(message) {
    wsHandlers.handle(message);
  }
  wsClient.client.onopen = function () {
    console.log('WebSocket Connected');
  };
  wsClient.client.onclose = () => {
    console.log('Web Socket Closed');
  };
};
