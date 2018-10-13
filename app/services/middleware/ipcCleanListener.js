/**
* @name: ipcCleanListener
* @description: 主进程ipc信号监听器
*/

const execFile = require(pathLocator('utils', 'exec-file.js'));
const fs = require('fs');

const SudoPrompt = require(pathLocator('utils', 'sudo-prompt.js'));
const notifySend = require(pathLocator('utils', 'notify-send.js'));

const sudo = new SudoPrompt();

function ipcClean(ipc) {
  // 用户root密码 //
  ipc.on('clean_handle-dirs', (event, args) => {
    const {
      dirs, action, content,
    } = args;
    const duPath = pathLocator('shell', 'clean-du.sh');
    const rmPath = pathLocator('shell', 'clean-rm.sh');
    let result = '';

    if (action === 'du') {
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
    } else if (action === 'rm') {
      sudo.spawnWithPasswd({
        _command: 'bash',
        _params: [rmPath].concat(dirs),
        _options: { encoding: 'utf8' },
        _stdout: (out) => {
          console.log(`out -> ${out}`);
        },
        _stderr: (err) => {
          console.log(`err -> ${err}`);
        },
        _close: (close) => {
          console.log(`close -> ${close}`);
        },
      });
    }
  });
}

module.exports = ipcClean;
