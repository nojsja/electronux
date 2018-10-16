/**
* @name: ipcStartupListener
* @description: 主进程ipc信号监听器
*/

const fs = require('fs');
const {BrowserWindow} = require('electron');

const notifySend = require(pathLocator('utils', 'notify-send.js'));

function ipcStartup(ipc) {
  ipc.on('frame-less-window', (event, args) => {
    // const win = new BrowserWindow({
    //   width: 800, height: 600, frame: false,
    // });
    // win.show();
  });
}

module.exports = ipcStartup;
