/**
* @name: ipcStartupListener
* @description: 主进程ipc信号监听器
*/

const { BrowserWindow } = require('electron');
const execFile = require(pathLocator('utils', 'exec-file'));
const child = require('child_process');

const notifySend = require(pathLocator('utils', 'notify-send.js'));

function ipcStartup(ipc) {
  ipc.on('startup_handle-files', (event, args) => {
    if (args.action === 'get') {
      const params = [args.dir];
      const lsPath = pathLocator('shell', 'startup_ls.sh');
      const catPath = pathLocator('shell', 'startup_cat.sh');
      const lsResult = (child.execSync(lsPath, params)).toString();

      execFile(catPath, params, ({ error, result }) => {
        event.sender.send('startup_handle-files_reply', {
          error,
          action: args.action,
          result: {
            files: lsResult,
            details: result,
          },
        });
      });
    } else if (args.action === 'set') {
      console.log(args);
    }
  });
}

module.exports = ipcStartup;
