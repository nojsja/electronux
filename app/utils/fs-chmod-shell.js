const { app } = require('electron');
const path = require('path');
const fsChmod = require('./fs-chmod');

function fsChmodShell() {
  fsChmod(path.join(app.getAppPath(), 'app/services/scripts'), 0o711);
}

module.exports = fsChmodShell;
