/**
* @name: ipcStartupListener
* @description: 主进程ipc信号监听器
*/

const { BrowserWindow } = require('electron');
const execFile = require(pathLocator('utils', 'exec-file'));
const exec = require(pathLocator('utils', 'exec'));
const child = require('child_process');

const notifySend = require(pathLocator('utils', 'notify-send.js'));

function ipcStartup(ipc) {
  /* ------------------- 修改文件属性 ------------------- */
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
      const {
        dir, file, Comment, Name, Exec, Hidden,
      } = args.detail;
      const setPath = pathLocator('shell', 'startup_set.sh');
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
    const addPath = pathLocator('shell', 'startup_new.sh');

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
