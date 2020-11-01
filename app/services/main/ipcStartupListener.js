/**
* @name: ipcStartupListener
* @description: 主进程ipc信号监听器
*/
const { app } = require('electron');
const child = require('child_process');
const path = require('path');
const execFile = require(path.join(app.getAppPath(), 'app/utils/exec-file'));
const exec = require(path.join(app.getAppPath(), 'app/utils/exec'));

function ipcStartup(ipc) {
  /* ------------------- 修改文件属性 ------------------- */
  ipc.on('startup_handle-files', (event, args) => {
    if (args.action === 'get') {
      const params = [args.dir];
      const lsPath = path.join(app.getAppPath(), 'app/services/scripts/startup-ls.sh');
      const catPath = path.join(app.getAppPath(), 'app/services/scripts/startup-cat.sh');
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

      execFile(setPath, params, ({ error, result }) => {
        event.sender.send('startup_handle-files_reply', {
          error,
          action: args.action,
          result,
        });
      });
    }
  });

  /* ------------------- 删除文件 ------------------- */
  ipc.on('startup_delete-files', (event, args) => {
    const { dir, file } = args;
    const command = `rm ${dir}/${file}`;
    exec(command, { encoding: 'utf8' }, ({ error, result }) => {
      event.sender.send('startup_delete-files_reply', {
        error,
        result,
      });
    });
  });

  /* ------------------- 添加文件 ------------------- */
  ipc.on('startup_add-files', (event, args) => {
    const { dir, file, detail } = args;
    const { Name, Comment, Exec } = detail;
    const addPath = path.join(app.getAppPath(), 'app/services/scripts/startup-new.sh');

    const params = ['-d', dir, '-n', Name, '-c', Comment, '-e', Exec];

    execFile(addPath, params, ({ error, result }) => {
      event.sender.send('startup_add-files_reply', {
        error,
        result,
      });
    });
  });
}

module.exports = ipcStartup;
