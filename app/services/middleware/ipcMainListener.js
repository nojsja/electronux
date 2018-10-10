/**
* @name: ipcMainListener
* @description: 主进程ipc信号监听器
*/

const execFile = require(pathLocator('utils', 'exec-file.js'));
const SudoPrompt = require(pathLocator('utils', 'sudo-prompt.js'));
const notifySend = require(pathLocator('utils', 'notify-send.js'));

const sudo = new SudoPrompt();

function ipcMain(ipc) {
  // 桌面通知发送 //
  ipc.on('notify-send', (event, args) => {
    notifySend({
      delay: args.delay || 0,
      title: args.title || 'electron',
      body: args.body || 'electron notification',
      icon: (args.icon && args.iconDir) ? pathLocator(args.iconDir, args.icon) : undefined,
    });
  });

  // 安装项检查 //
  ipc.on('install_exec-file.check', (event, args) => {
    const path = pathLocator(args.dir, args.target);
    execFile(path, args.params, (rsp) => {
      event.sender.send('install_exec-file_reply.check', rsp);
    });
  });

  // archlinuxcn 源检查操作 //
  ipc.on('install_source-check.configure', (event, args) => {
    const path = pathLocator(args.dir, args.target);
    execFile(path, args.params, (rsp) => {
      const result = {
        result: (parseInt(rsp.result) === 0),
        error: rsp.error,
      };
      event.sender.send('install_source-check_reply.configure', result);
    });
  });

  // archlinuxcn 源配置操作 //
  ipc.on('install_source-config.configure', (event, args) => {
    const path = pathLocator(args.dir, args.target);
    const stdout = (data) => {
      event.sender.send('install_terminal-info_reply', {
        error: null,
        params: args.params,
        result: data,
      });
    };
    const stderr = (data) => {
      event.sender.send('install_terminal-info_reply', {
        error: new Error(data),
        params: args.params,
        result: data,
      });
    };
    const close = (code) => {
      if (code === 0) {
        event.sender.send('install_source-config_reply.configure', {
          error: null,
          params: args.params,
          result: null,
        });
      } else {
        event.sender.send('install_source-config_reply.configure', {
          error: new Error(` install error code: ${code}`),
          params: args.params,
          result: null,
        });
      }
    };

    sudo.spawn({
      _command: 'bash',
      _params: [path, args.params],
      _options: {},
      _stdout: stdout,
      _stderr: stderr,
      _close: close,
    });
  });

  // 安装项安装 //
  ipc.on('install_exec-file.do', (event, args) => {
    const path = pathLocator(args.dir, args.target);

    /* sudo.execFile version */
    // sudo.execFile(path, args.params).then((result) => {
    //   event.sender.send('install_exec-file_reply.do', {
    //     error: null,
    //     params: args.params,
    //     result,
    //   });
    // }, (err) => {
    //   console.error(err);
    //   event.sender.send('install_exec-file_reply.do', {
    //     error: err,
    //     params: args.params,
    //     result: err,
    //   });
    // });

    /* sudo.spawn version */
    const stdout = (data) => {
      event.sender.send('install_terminal-info_reply', {
        error: null,
        params: args.params,
        result: data,
      });
    };
    const stderr = (data) => {
      event.sender.send('install_terminal-info_reply', {
        error: new Error(data),
        params: args.params,
        result: data,
      });
    };
    const close = (code) => {
      if (code === 0) {
        event.sender.send('install_exec-file_reply.do', {
          error: null,
          params: args.params,
          result: null,
        });
      } else {
        event.sender.send('install_exec-file_reply.do', {
          error: new Error(` install error code: ${code}`),
          params: args.params,
          result: null,
        });
      }
    };

    sudo.spawn({
      _command: 'bash',
      _params: [path, args.params],
      _options: {},
      _stdout: stdout,
      _stderr: stderr,
      _close: close,
    });
  });

  // 安装项卸载 //
  ipc.on('install_exec-file.undo', (event, args) => {
    const path = pathLocator(args.dir, args.target);
    // sudo.execFile(path, args.params).then((result) => {
    //   event.sender.send('install_exec-file_reply.undo', {
    //     error: null,
    //     params: args.params,
    //     result,
    //   });
    // }, (err) => {
    //   console.error(err);
    //   event.sender.send('install_exec-file_reply.undo', {
    //     error: err,
    //     params: args.params,
    //     result: err,
    //   });
    // });

    const stdout = (data) => {
      event.sender.send('install_terminal-info_reply', {
        error: null,
        params: args.params,
        result: data,
      });
    };
    const stderr = (data) => {
      event.sender.send('install_terminal-info_reply', {
        error: new Error(data),
        params: args.params,
        result: data,
      });
    };
    const close = (code) => {
      if (code === 0) {
        event.sender.send('install_exec-file_reply.undo', {
          error: null,
          params: args.params,
          result: null,
        });
      } else {
        event.sender.send('install_exec-file_reply.undo', {
          error: new Error(` uninstall error code: ${code}`),
          params: args.params,
          result: null,
        });
      }
    };

    sudo.spawn({
      _command: 'bash',
      _params: [path, args.params],
      _options: {},
      _stdout: stdout,
      _stderr: stderr,
      _close: close,
    });
  });
}

module.exports = ipcMain;
