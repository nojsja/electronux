/**
* @name: ipcStartupListener
* @description: 主进程ipc信号监听器
*/
const { app, nativeImage } = require('electron');
const child = require('child_process');
const path = require('path');
const { resolve } = require('path');
const execFile = require(path.join(app.getAppPath(), 'app/utils/exec-file'));
const exec = require(path.join(app.getAppPath(), 'app/utils/exec'));

class IpcStartup {
  /* ------------------- 修改文件属性 ------------------- */
  constructor() {
    this.confDirPath = '~/.config/autostart/';
  }

  /* 获取启动项目配置文件 */
  getStartupConfig(args) {
    const params = [args.dir];
    const lsPath = path.join(app.getAppPath(), 'app/services/scripts/startup-ls.sh');
    const catPath = path.join(app.getAppPath(), 'app/services/scripts/startup-cat.sh');
    const lsResult = (child.execSync(lsPath, params)).toString();
    const files = lsResult.split(' ').filter(p => p).map((p) => path.join(this.confDirPath, p));

    return new Promise((resolve, reject) => {
      (files.length ? app.getFileIcon(files[0]) : Promise.resolve(''))
      .then((iconPath) => {
        execFile(catPath, params, ({ error, result }) => {
          resolve({
            code: 200,
            result: {
              error,
              action: args.action,
              files: lsResult,
              details: result,
              iconPath: iconPath ? iconPath.toDataURL() : ''
            }
          })
        });
      })
      .catch(error => {
        resolve({
          code: 200,
          result: {
            error: error.toString(),
            action: args.action,
            files: lsResult,
          }
        })
      })
    })

  }

  /* 修改启动项目配置文件 */
  modifyStartupConfig(args) {
    const {
      dir, file, Comment, Name, Exec, Hidden,
    } = args.detail;
    const setPath = path.join(app.getAppPath(), 'app/services/scripts/startup-set.sh');
    let params = [
      '-d', dir, '-f', file,
      '-kv', 'Hidden', Hidden,
    ];
    if (Comment) params = params.concat(['-kv', 'Comment', Comment]);
    if (Name) params = params.concat(['-kv', 'Name', Name]);
    if (Exec) params = params.concat(['-kv', 'Exec', Exec]);

    return new Promise((resolve, reject) => {
      execFile(setPath, params, ({ error, result }) => {
        resolve({
          code: 200,
          result: {
            error,
            action: args.action,
            result,
          }
        });
      });
    });

  }

  /* 删除启动项目 */
  deleteStartupItem(args) {
    const { dir, file } = args;
    const command = `rm ${dir}/${file}`;

    return new Promise((resolve, reject) => {
      exec(command, { encoding: 'utf8' }, ({ error, result }) => {
        resolve({
          code: 200,
          result: {
            error,
            result,
          }
        });
      });
    });
  }

  /* 添加启动项目 */
  addStartupItem() {
    const { dir, file, detail } = args;
    const { Name, Comment, Exec } = detail;
    const addPath = path.join(app.getAppPath(), 'app/services/scripts/startup-new.sh');

    const params = ['-d', dir, '-n', Name, '-c', Comment, '-e', Exec];

    return new Promise((resolve, reject) => {
      execFile(addPath, params, ({ error, result }) => {
        resolve({
          code: 200,
          result: {
            error,
            result,
          }
        });
      });
    });
  }
}

module.exports = IpcStartup;
