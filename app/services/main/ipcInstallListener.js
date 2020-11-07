/**
* @name: ipcMainListener
* @description: 主进程ipc信号监听器
*/
const { app } = require('electron');
const path = require('path');

const execFile = require(path.join(app.getAppPath(), 'app/utils/exec-file.js'));

const SudoPrompt = require(path.join(app.getAppPath(), 'app/utils/sudo-prompt.js'));
const { notifySend } = require(path.join(app.getAppPath(), 'app/utils/utils'));

const sudo = new SudoPrompt();

function ipcMain(ipc) {
  // 用户root密码 //
  ipc.on('public_password', (event, args) => {
    if (args.action === 'set') {
      sudo.setPassword(args.password);
      notifySend({
        delay: 0,
        title: 'electron-tips',
        body: `New Password: [ ${args.password} ]`,
        icon: path.join(app.getAppPath(), 'resources/public/settings.png'),
      });
    } else if (args.action === 'read') {
      const passwd = sudo.readPassword();
      event.sender.send('public_password-read_replay', { error: null, result: passwd });
    }
  });

  // 安装项检查 //
  ipc.on('install_exec-file.check', (event, args) => {
    const _path = path.join(app.getAppPath(), 'app/services/scripts', args.target);
    execFile(_path, args.params, (rsp) => {
      if (rsp.error) {
        console.log(rsp);
      }
      event.sender.send('install_exec-file_reply.check', rsp);
    });
  });

  // archlinuxcn 源检查操作 //
  ipc.on('install_source-check.configure', (event, args) => {
    const _path = path.join(app.getAppPath(), 'app/services/scripts', args.target);
    execFile(_path, args.params, (rsp) => {
      if (rsp.error) {
        console.log(rsp);
      }
      const result = {
        result: (parseInt(rsp.result) === 0),
        error: 'Command Not Found: pacman' || rsp.error,
      };
      event.sender.send('install_source-check_reply.configure', result);
    });
  });

  // archlinuxcn 测试带密码执行命令 //
  ipc.on('sudo-with-password', (event, args) => {
    const _path = path.join(app.getAppPath(), 'app/services/scripts/sudo-test.sh');
    sudo.spawnWithPasswd({
      _command: 'bash',
      _params: [path],
      _options: {},
    });
  });

  // archlinuxcn 源配置操作 //
  ipc.on('install_source-config.configure', (event, args) => {
    const _path = path.join(app.getAppPath(), 'app/services', args.target);
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
      _params: [_path, args.params],
      _options: {},
      _stdout: stdout,
      _stderr: stderr,
      _close: close,
    });
  });

  // 安装项安装 //
  ipc.on('install_exec-file.do', (event, args) => {
    const _path = path.join(app.getAppPath(), 'app/services', args.target);

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
      _params: [_path, args.params],
      _options: {},
      _stdout: stdout,
      _stderr: stderr,
      _close: close,
    });
  });

  // 安装项卸载 //
  ipc.on('install_exec-file.undo', (event, args) => {
    const _path = path.join(app.getAppPath(), 'app/services', args.target);
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
      _params: [_path, args.params],
      _options: {},
      _stdout: stdout,
      _stderr: stderr,
      _close: close,
    });
  });
}

module.exports = ipcMain;
