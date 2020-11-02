/**
* @name: IpcClean
* @description: 主进程ipc信号监听器
*/
const { app }  = require('electron');
const path = require('path');
const SudoPrompt = require(path.join(app.getAppPath(), 'app/utils/sudo-prompt.js'));

const sudo = new SudoPrompt();

class IpcClean {
  // 用户root密码 //
  handleDirs(args) {
    const duPath = path.join(app.getAppPath(), 'app/services/scripts/clean-du.sh');
    const rmPath = path.join(app.getAppPath(), 'app/services/scripts/clean-rm.sh');
    let result = '', error;
  
    return new Promise(function(resolve, reject) {

      const { dirs, content, action, allDirs } = args;
      const scriptPath = action === 'du' ? duPath : rmPath;
      const targetDirs = action === 'du' ? dirs : allDirs;
      
      sudo.spawnWithPasswd({
        _command: 'bash',
        _params: [scriptPath].concat(targetDirs),
        _options: { encoding: 'utf8' },
        _stdout: (out) => {
          result += out;
        },
        _close: (code) => {
          if (code === 0) {
            error = null;
          } else {
            error=`exec ${scriptPath} error!`;
          }
          resolve({
            code: 200,
            result: {
              content,
              action,
              result,
              error
            }
          })
        },
      });
    })
  }
}

module.exports = IpcClean;
