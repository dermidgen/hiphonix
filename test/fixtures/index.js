const fs = require('fs');
const path = require('path');

// Provides stubs for commands that don't have a fixture
// or commands that return a different fixture.
function selectFixture(cmd) {
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
    default:
      return path.join(__dirname, `${cmd}.json`);
  }
};

function fixtures(cmd) {
  const fixture = selectFixture(cmd);
  let data = {};

  try {
    data = (!fixture) ? '' : JSON.parse(fs.readFileSync(fixture, 'utf8'));
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
