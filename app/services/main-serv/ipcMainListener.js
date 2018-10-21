/**
* @name: ipcCleanListener
* @description: 主进程ipc信号监听器
*/

const fs = require('fs');

const notifySend = require(pathLocator('utils', 'notify-send.js'));
const viewConf = require(pathLocator('app', 'configure/view-conf.js'));

function ipcMain(ipc) {
  process.on('uncaughtException', (err) => {
    console.log('<---------------');

    const errorInfo = err.stack.toString();
    console.log(errorInfo);
    const errorFile = pathLocator('runtime', 'error.log');
    fs.writeFile(errorFile, errorInfo, { encoding: 'utf8', flag: 'w' }, (_err) => {
      if (_err) console.log(_err);
    });

    console.log('--------------->');
  });
}

module.exports = ipcMain;
