const fs = require('fs');
const path = require('path');

function fixtures(cmd) {
  const file = path.join(__dirname, `${cmd}.json`);
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
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
