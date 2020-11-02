/**
* @name: ipcCleanListener
* @description: 主进程ipc信号监听器
*/
const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const { notifySend } = require(path.join(app.getAppPath(), 'app/utils/utils'));

function ipcMain(ipc) {
  // 桌面通知发送 //
  ipc.on('notify-send', (event, args) => {
    const iconAddr = args.icon || 'resources/public/electronux.png';
    notifySend({
      delay: args.delay || 0,
      title: args.title || 'electron',
      body: args.body || 'electron notification',
      icon: path.join(app.getAppPath(), iconAddr),
    });
  });

  // 未捕获的全局错误 //
  process.on('uncaughtException', (err) => {
    console.log('<---------------');

    const errorInfo = err.stack.toString();
    console.log(errorInfo);
    const errorFile = path.join(pathRuntime, 'error.log');
    fs.writeFile(errorFile, errorInfo, { encoding: 'utf8', flag: 'w' }, (_err) => {
      if (_err) console.log(_err);
    });

    console.log('--------------->');
  });
}

module.exports = ipcMain;
