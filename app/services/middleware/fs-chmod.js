const fs = require('fs');
const path = require('path');

function fsChmod() {
  const prePath = path.join(__dirname, '../shell');
  const files = fs.readdirSync(prePath);
  if (files.length) {
    files.forEach((file) => {
      fs.chmodSync(path.join(prePath, file), '755');
    });
  }
}

module.exports = fsChmod;
