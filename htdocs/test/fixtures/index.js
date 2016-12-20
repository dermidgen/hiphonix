const debug = require('debug')('hip:fixtures');
const util = require('util');
const fs = require('fs');
const path = require('path');

const i = (obj, depth = 1) => {
  return '\n' + util.inspect(obj, { depth, colors: true })
}

// Provides stubs for commands that don't have a fixture
// or commands that return a different fixture.
function selectFixture(cmd, params) {
  switch(cmd) {
    case 'MPD_API_SET_PAUSE':
      return '';
    break;
    case 'MPD_API_SET_STOP':
      return '';
    break;
    case 'MPD_API_TOGGLE_RANDOM':
      return '';
    break;
    case 'MPD_API_TOGGLE_SINGLE':
      return '';
    break;
    case 'MPD_API_TOGGLE_REPEAT':
      return '';
    break;
    case 'MPD_API_ADD_TRACK':
      return path.join(__dirname, `UPDATE_QUEUE.json`);
    break;
    case 'MPD_API_RM_TRACK':
      return path.join(__dirname, `UPDATE_QUEUE.json`);
    break;
    case 'MPD_API_MOVE_TRACK':
      return path.join(__dirname, `UPDATE_QUEUE.json`);
    break;
    case 'MPD_API_ADD_PLAYLIST':
      return path.join(__dirname, `UPDATE_QUEUE.json`);
    break;
    case 'MPD_API_GET_BROWSE':
      var index = path.join(
        __dirname,
        (params[1] || '/'),
        `MPD_API_GET_BROWSE.json`
      );
      debug(i({ index }));
      return index
    break;
    default:
      return path.join(__dirname, `${cmd}.json`);
  }
};

function fixtures(cmd, params) {
  const fixture = selectFixture(cmd, params);
  let data = {};

  try {
    data = (!fixture) ? null : JSON.parse(fs.readFileSync(fixture, 'utf8'));
  } catch (e) {
    data = {
      type: "error",
      data: {
        unimplemented: true
      }
    };
  }

  return data;
}

module.exports = fixtures;
