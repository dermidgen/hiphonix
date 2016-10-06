import { EventEmitter } from 'events';

const host = 'ws://localhost:8080/ws';
const protocol = 'echo-protocol';

class Socket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.open();
  }

  close() {
    if (this.ws) this.ws.close();
  }

  open() {
    const ws = this.ws = new WebSocket(host, protocol);
    ws.onmessage = m => {
      // Apparently the server sends empty frames
      if (!m.data) return;

      try {
        var message = JSON.parse(m.data);
        console.log('[client::onmessage]: %o', message);
        this.emit('message', message);
      } catch(e) {
        console.log('[client::onmessage]: %o', m);
        console.error('[client::onmessageerror] %o', e);
      }
    };
    ws.onopen = () => {
      console.info('[client::onopen]:');
      this.emit('open', {
        connection: 'true',
      });
    };
    ws.onclose = () => {
      console.info('[client::onclose]:');
      this.emit('close', {
        connection: 'false',
      });
    };
    ws.onerror = e => {
      console.error('[client::onerror]: %o', e);
      this.emit('error', e);
    };
  }
}

module.exports = Socket;
