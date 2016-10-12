const fs = require('fs');
const path = require('path');

const MPD_STATE = {
  STOPPED: 1,
  PLAYING: 2,
  PAUSED: 3,
};

let state = MPD_STATE.STOPPED;

function selectFixture(cmd) {
  switch(cmd) {
    case 'STATE':
      if (state === MPD_STATE.STOPPED) {
        return path.join(__dirname, `${cmd}.json`);
      } else if (state === MPD_STATE.PLAYING) {
        return path.join(__dirname, `${cmd}_PLAYING.json`);
      } else if (state === MPD_STATE.PAUSED) {
        return path.join(__dirname, `${cmd}_PAUSED.json`);
      } 
    break;
    case 'MPD_API_SET_PLAY':
      state: MPD_STATE.PLAYING;
      return path.join(__dirname, `${cmd}.json`);
    break;
    case 'MPD_API_SET_PAUSE':
      state: MPD_STATE.PAUSED;
      return path.join(__dirname, `${cmd}.json`);
    break;
    case 'MPD_API_SET_STOP':
      state: MPD_STATE.STOPPED;
      return path.join(__dirname, `${cmd}.json`);
    break;
    default:
      return path.join(__dirname, `${cmd}.json`);
  }
};

function fixtures(cmd) {
  const fixture = selectFixture(cmd);
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(fixture, 'utf8'));
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
