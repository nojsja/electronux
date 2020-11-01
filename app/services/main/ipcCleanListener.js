/**
* @name: ipcCleanListener
* @description: 主进程ipc信号监听器
*/
const { app }  = require('electron');
const path = require('path');
const execFile = require(path.join(__dirname, '../../', 'utils/exec-file.js'));
const fs = require('fs');

const SudoPrompt = require(path.join(__dirname, '../../', 'utils/sudo-prompt.js'));
const { notifySend } = require(path.join(__dirname, '../../', 'utils/utils'));

const sudo = new SudoPrompt();

function ipcClean(ipc) {
  // 用户root密码 //
  ipc.on('clean_handle-dirs', (event, args) => {
    const duPath = path.join(app.getAppPath(), 'app/services/scripts/clean-du.sh');
    const rmPath = path.join(app.getAppPath(), 'app/services/scripts/clean-rm.sh');
    let result = '';

    if (args.action === 'du') {
      const { dirs, content, action } = args;
      sudo.spawnWithPasswd({
        _command: 'bash',
        _params: [duPath].concat(dirs),
        _options: { encoding: 'utf8' },
        _stdout: (out) => {
          result += out;
        },
        _close: (code) => {
          if (code === 0) {
            event.sender.send('clean_handle-dirs_replay', {
              content,
              action,
              result,
              error: null,
            });
          } else {
            event.sender.send('clean_handle-dirs_replay', {
              content,
              action,
              result,
              error: `exec ${duPath} error!`,
            });
          }
        },
      });
    } else if (args.action === 'rm') {
      const {
        paths, content, allDirs, action,
      } = args;
      sudo.spawnWithPasswd({
        _command: 'bash',
        _params: [rmPath].concat(allDirs),
        _options: { encoding: 'utf8' },
        _stdout: (out) => {
          result += out;
        },
        _close: (code) => {
          if (code === 0) {
            event.sender.send('clean_handle-dirs_replay', {
              content,
              action,
              result,
              error: null,
            });
          } else {
            event.sender.send('clean_handle-dirs_replay', {
              content,
              action,
              result,
              error: `exec ${rmPath} error!`,
            });
          }
        },
      });
    }
  });
}

module.exports = ipcClean;
