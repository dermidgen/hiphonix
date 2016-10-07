import EventListener from 'events';
import Socket from './socket';

let ws;
const version = '0';
const features = {
  actions: [
    { command: 'MPD_API_GET_BROWSE',       event: 'browse', },
    { command: 'MPD_API_SEARCH',           event: 'search', },
    { command: 'MPD_API_GET_QUEUE',        event: '', },
    { command: 'MPD_API_SAVE_QUEUE',       event: '', },
    { command: 'MPD_API_ADD_TRACK',        event: '', },
    { command: 'MPD_API_ADD_PLAY_TRACK',   event: '', },
    { command: 'MPD_API_ADD_PLAYLIST',     event: '', },
    { command: 'MPD_API_RM_TRACK',         event: '', },
    { command: 'MPD_API_PLAY_TRACK',       event: '', },
    { command: 'MPD_API_SET_PLAY',         event: '', },
    { command: 'MPD_API_SET_PAUSE',        event: '', },
    { command: 'MPD_API_SET_NEXT',         event: '', },
    { command: 'MPD_API_SET_PREV',         event: '', },
    { command: 'MPD_API_SET_SEEK',         event: '', },
    { command: 'MPD_API_SET_VOLUME',       event: '', },
    { command: 'MPD_API_TOGGLE_RANDOM',    event: '', },
    { command: 'MPD_API_TOGGLE_CONSUME',   event: '', },
    { command: 'MPD_API_TOGGLE_SINGLE',    event: '', },
    { command: 'MPD_API_TOGGLE_CROSSFADE', event: '', },
    { command: 'MPD_API_TOGGLE_REPEAT',    event: '', },
    { command: 'MPD_API_TOGGLE_OUTPUT',    event: '', },
    { command: 'MPD_API_GET_OUTPUTS',      event: 'outputnames', },
    { command: 'MPD_API_SET_MPDHOST',      event: '', },
    { command: 'MPD_API_SET_MPDPASS',      event: '', },
    { command: 'MPD_API_UPDATE_DB',        event: '', },
    { command: 'NL_SCAN',                  event: '', },
    { command: 'NL_LIST',                  event: '', },
    { command: 'NL_DISCONNECT',            event: '', },
    { command: 'NL_JOIN',                  event: '', },
    { command: 'NL_RESET',                 event: '', },
    { command: 'SYS_RESET',                event: '', },
    { command: 'SYS_RESTART',              event: '', },
    { command: 'SYS_UPGRADE',              event: '', },
  ],
  events: [
    'state',
    'browse',
    'outputnames',
    'outputs',
  ],
};

class API extends EventListener {
  constructor() {
    super();

    ws = new Socket();
    ws.on('open', (state) => {
      this.emit('connected', state);
    });

    ws.on('close', (state) => {
      this.emit('disconnected', state);
    });

    ws.on('error', (error) => {
      this.emit('error', error);
    });

    ws.on('message', (message) => {
      if (message.type) this.emit(message.type, message);
    });
  }

  command(cmd, params) {
    let feature = features.actions.find((item) => { return item.command === cmd; });
    if (!feature) throw new Error('Not implemented');
    ws.send(cmd + ',' + params.join(','));
  }

  static get VERSION() {
    return version;
  }
}

module.exports = API;
