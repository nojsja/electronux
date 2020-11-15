const { app } = require('electron');
const path = require('path');
const msgc = require(path.join(app.getAppPath(), 'app/web/libs/MessageChannel.class'));

const execFile = require(path.join(app.getAppPath(), 'app/utils/exec-file.js'));
const SudoPrompt = require(path.join(app.getAppPath(), 'app/utils/sudo-prompt.js'));
const { notifySend } = require(path.join(app.getAppPath(), 'app/utils/utils'));

const sudo = new SudoPrompt(app);

/* use MessageChannel */
msgc.on('service-event', (event, args) => {
  console.log('on: ', args);
  msgc.sendTo(event.senderId, 'service-callback', args);
});

msgc.handle('service-handle', (event, args) => {
  console.log('handle: ', args);
  return Promise.resolve('service-handle-value');
});


// 用户root密码 //
msgc.on('public_password', (event, args) => {
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
    msgc.sendTo(event.senderId, 'public_password-read_replay', { error: null, result: passwd });
  }
});

// 安装项检查 //
msgc.on('install_exec-file.check', (event, args) => {
  console.log('install_exec-file.check');
  const _path = path.join(app.getAppPath(), 'app/services/scripts', args.target);
  execFile(_path, args.params, (rsp) => {
    if (rsp.error) {
      console.log(rsp);
    }
    msgc.sendTo(event.senderId, 'install_exec-file_reply.check', rsp);
  });
});

// archlinuxcn 源检查操作 //
msgc.on('install_source-check.configure', (event, args) => {
  const _path = path.join(app.getAppPath(), 'app/services/scripts', args.target);
  execFile(_path, args.params, (rsp) => {
    if (rsp.error) {
      console.log(rsp);
    }
    const result = {
      result: (parseInt(rsp.result) === 0),
      error: 'Command Not Found: pacman' || rsp.error,
    };
    msgc.sendTo(event.senderId, 'install_source-check_reply.configure', result);
  });
});

// archlinuxcn 测试带密码执行命令 //
msgc.on('sudo-with-password', (event, args) => {
  const _path = path.join(app.getAppPath(), 'app/services/scripts/sudo-test.sh');
  sudo.spawnWithPasswd({
    _command: 'bash',
    _params: [path],
    _options: {},
  });
});

// archlinuxcn 源配置操作 //
msgc.on('install_source-config.configure', (event, args) => {
  const _path = path.join(app.getAppPath(), 'app/services/scripts', args.target);
  const stdout = (data) => {
    msgc.sendTo(event.senderId, 'install_terminal-info_reply', {
      error: null,
      params: args.params,
      result: data,
    });
  };
  const stderr = (data) => {
    msgc.sendTo(event.senderId, 'install_terminal-info_reply', {
      error: new Error(data),
      params: args.params,
      result: data,
    });
  };
  const close = (code) => {
    if (code === 0) {
      msgc.sendTo(event.senderId, 'install_source-config_reply.configure', {
        error: null,
        params: args.params,
        result: null,
      });
    } else {
      msgc.sendTo(event.senderId, 'install_source-config_reply.configure', {
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
msgc.on('install_exec-file.do', (event, args) => {
  const _path = path.join(app.getAppPath(), 'app/services/scripts', args.target);

  /* sudo.spawn version */
  const stdout = (data) => {
    msgc.sendTo(event.senderId, 'install_terminal-info_reply', {
      error: null,
      params: args.params,
      result: data,
    });
  };
  const stderr = (data) => {
    msgc.sendTo(event.senderId, 'install_terminal-info_reply', {
      error: new Error(data),
      params: args.params,
      result: data,
    });
  };
  const close = (code) => {
    if (code === 0) {
      msgc.sendTo(event.senderId, 'install_exec-file_reply.do', {
        error: null,
        params: args.params,
        result: null,
      });
    } else {
      msgc.sendTo(event.senderId, 'install_exec-file_reply.do', {
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
msgc.on('install_exec-file.undo', (event, args) => {
  const _path = path.join(app.getAppPath(), 'app/services/scripts', args.target);

  const stdout = (data) => {
    msgc.sendTo(event.senderId, 'install_terminal-info_reply', {
      error: null,
      params: args.params,
      result: data,
    });
  };
  const stderr = (data) => {
    msgc.sendTo(event.senderId, 'install_terminal-info_reply', {
      error: new Error(data),
      params: args.params,
      result: data,
    });
  };
  const close = (code) => {
    if (code === 0) {
      msgc.sendTo(event.senderId, 'install_exec-file_reply.undo', {
        error: null,
        params: args.params,
        result: null,
      });
    } else {
      msgc.sendTo(event.senderId, 'install_exec-file_reply.undo', {
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