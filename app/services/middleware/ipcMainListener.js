/**
* @name: ipcMainListener
* @description: 主进程ipc信号监听器
*/

const execFile = require(pathLocator('utils', 'exec-file.js'));
const SudoPrompt = require(pathLocator('utils', 'sudo-prompt.js'));

const sudo = new SudoPrompt();

function ipcMain(ipc) {
  // 安装项检查 //
  ipc.on('install_exec-file.check', (event, args) => {
    const path = pathLocator(args.dir, args.target);
    execFile(path, args.params, (rsp) => {
      event.sender.send('install_exec-file_reply.check', rsp);
    });
  });

  // 安装项安装 //
  ipc.on('install_exec-file.do', (event, args) => {

    const path = pathLocator(args.dir, args.target);

    sudo.execFile(path, args.params).then((result) => {
      event.sender.send('install_exec-file_reply.do', {
        error: null,
        params: args.params,
        result,
      });
    }, (err) => {
      console.error(err);
      event.sender.send('install_exec-file_reply.do', {
        error: err,
        params: args.params,
        result: err,
      });
    });
  });

  // 安装项卸载 //
  ipc.on('install_exec-file.undo', (event, args) => {
    const path = pathLocator(args.dir, args.target);
    sudo.execFile(path, args.params).then((result) => {
      event.sender.send('install_exec-file_reply.undo', {
        error: null,
        params: args.params,
        result,
      });
    }, (err) => {
      console.error(err);
      event.sender.send('install_exec-file_reply.undo', {
        error: err,
        params: args.params,
        result: err,
      });
    });
  });
}

module.exports = ipcMain;
