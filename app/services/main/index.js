/**
* @name: ipcCleanListener
* @description: 主进程ipc信号监听器
*/
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

/* tool */
const { notifySend } = require(path.join(app.getAppPath(), 'app/utils/utils'));
const ipcBridge = require(path.join(app.getAppPath(), 'app/utils/ipcBridge'));

/* model */
const SettingModel = require('../model/Setting');
const InfoModel = require('../model/Info');
const CleanModel = require('../model/Clean');
const StartupModel = require('../model/Startup');

class IpcMainProcess {
  constructor(ipc) {
    this.ipc = ipc;
    this.settingModel = ipcBridge(this.ipc, 'setting',new SettingModel());
    this.infoModel = ipcBridge(this.ipc, 'info', new InfoModel());
    this.cleanModel = ipcBridge(this.ipc, 'clean', new CleanModel());
    this.startupModel = ipcBridge(this.ipc, 'startup', new StartupModel());
    this.ipc.on('notify-send', (event, args) => {
      this.notifySend(args);
    });
  }

  // 桌面通知发送 //
  notifySend(args = {}) {
    const iconAddr = args.icon || 'resources/icon.png';
    notifySend({
      delay: args.delay || 0,
      title: args.title || 'electron',
      body: args.body || 'electron notification',
      icon: path.join(app.getAppPath(), iconAddr),
    });
  }
}

// 未捕获的全局错误 //
process.on('uncaughtException', (err) => {
  console.error('<---------------');

  const errorInfo = err.stack.toString();
  console.log(errorInfo);
  const errorFile = path.join(app.getAppPath(), 'runtime/error.log');
  fs.writeFile(errorFile, errorInfo, { encoding: 'utf8', flag: 'w' }, (_err) => {
    if (_err) console.log(_err);
  });

  console.error('--------------->');
});

module.exports = IpcMainProcess;
