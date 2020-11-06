const { app } = require('electron');
const path = require('path');
const fsChmod = require('./fs-chmod');

function fsChmodShell() {
  fsChmod(path.join(pathRuntime, 'scripts'), 0o711);
}

module.exports = fsChmodShell;
