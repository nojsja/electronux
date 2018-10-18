import { observable, action, computed } from 'mobx';

import consoleLog from '../utils/console-log';
import jsonstr2Object from '../utils/jsonstr2Ojbect';
import codeMessage from '../configure/code-message';

const { ipcRenderer } = require('electron'); // 渲染进程

class Install {
  @observable items = { // 所有安装项
    'oh-my-zsh': false,
    node: false,
    atom: false,
    vscode: false,
    chrome: false,
    wechat: false,
    'deepin-capture': false,
    'deepin-terminal': false,
    peek: false,
    easeMusic: false,
    QQ: false,
    albert: false,
    whatever: false,
  };

  defaultTermInfo = 'System Terminal Info: ';

  @observable terminalInfo = {
    'oh-my-zsh': this.defaultTermInfo,
    node: this.defaultTermInfo,
    atom: this.defaultTermInfo,
    vscode: this.defaultTermInfo,
    chrome: this.defaultTermInfo,
    wechat: this.defaultTermInfo,
    'deepin-capture': this.defaultTermInfo,
    'deepin-terminal': this.defaultTermInfo,
    peek: this.defaultTermInfo,
    easeMusic: this.defaultTermInfo,
    QQ: this.defaultTermInfo,
    albert: this.defaultTermInfo,
    whatever: this.defaultTermInfo,
  }

  @observable loadingMain = true; // 主界面加载

  @observable sourceChecked = false; // archlinuxcn 源头的设置情况

  @observable queue = { // 任务执行队列
    install: [],
    uninstall: [],
  };

  constructor() {
    const that = this;

    /* ------------------- ipc render ------------------- */

    // 检查脚本文件事件 //
    ipcRenderer.on('install_exec-file_reply.check', (event, rsp) => {
      this.loadingMain = false;
      if (rsp.error) {
        console.log(rsp.error);
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code),
          body: `ERROR: " ${rsp.error.cmd} "`,
          icon: 'public/electronux.png',
          iconDir: 'resources',
        });
      } else {
        // const all = rsp.result.split('|');
        // const installed = all.shift().split(' ');
        // const uninstalled = all.shift().split(' ');
        rsp.result = jsonstr2Object(`${rsp.result}`);
        const all = Object.keys(rsp.result);
        const installed = all.filter(item => (rsp.result[item] === true) || (rsp.result[item] === 'true'));
        const uninstalled = all.filter(item => (rsp.result[item] === false) || (rsp.result[item] === 'false'));
        that.update(installed, uninstalled);
      }
    });

    // 安装脚本文件事件 //
    ipcRenderer.on('install_exec-file_reply.do', (event, rsp) => {
      // this.loadingMain = false;
      rsp.params.forEach((item) => {
        this.outqueue(item, 'install');
      });
      if (rsp.error) {
        console.log(rsp.error);
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code),
          body: `ERROR: " ${rsp.error.cmd} "`,
          icon: 'public/electronux.png',
          iconDir: 'resources',
        });
      } else {
        consoleLog('install.do: ', rsp.result);
        rsp.params.forEach((name) => {
          that.updateOne(name, true);
        });
      }
    });

    // 卸载脚本文件事件 //
    ipcRenderer.on('install_exec-file_reply.undo', (event, rsp) => {
      // this.loadingMain = false;
      rsp.params.forEach((item) => {
        this.outqueue(item, 'uninstall');
      });
      if (rsp.error) {
        console.log(rsp.error);
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code),
          body: `ERROR: " ${rsp.error.cmd} "`,
          icon: 'public/electronux.png',
          iconDir: 'resources',
        });
      } else {
        consoleLog('install.undo: ', rsp.result);
        rsp.params.forEach((name) => {
          that.updateOne(name, false);
        });
      }
    });

    // 更新terminal终端信息事件 //
    ipcRenderer.on('install_terminal-info_reply', (event, rsp) => {
      if (rsp.error) {
        console.log(rsp.error);
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code),
          body: `ERROR: " ${rsp.error.cmd} "`,
          icon: 'public/electronux.png',
          iconDir: 'resources',
        });
      } else {
        that.updateTerminal(rsp.params, rsp.result);
      }
    });

    // source 源检查操作 //
    ipcRenderer.on('install_source-check_reply.configure', (event, rsp) => {
      if (rsp.error) {
        console.log(rsp.error);
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code),
          body: `ERROR: " ${rsp.error.cmd} "`,
          icon: 'public/electronux.png',
          iconDir: 'resources',
        });
      } else {
        that.sourceChecked = rsp.result;
      }
    });

    // source 源添加操作 //
    ipcRenderer.on('install_source-config_reply.configure', (event, rsp) => {
      if (rsp.error) {
        console.log(rsp.error);
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code),
          body: `ERROR: " ${rsp.error.cmd} "`,
          icon: 'public/electronux.png',
          iconDir: 'resources',
        });
      } else {
        that.refresh();
      }
    });
  }

  /* ------------------- computed ------------------- */

  // 安装项数组 //
  @computed get totalArray() {
    return Object.keys(this.items).map(item => item);
  }

  // 获取所有安装项 //
  get total() {
    const { items } = this;
    const dir = 'resources/install';

    return Object.keys(items).map(item => ({
      label: item,
      status: items[item],
      url: [dir, (`${item}.png`)].join('/'),
    }));
  }

  // 获取所有已安装项 //
  get installed() {
    return Object.keys(this.items).filter(item => this.items[item]);
  }

  // 获取所有未安装项 //
  get uninstalled() {
    return Object.keys(this.items).filter(item => !this.items[item]);
  }

  /* ------------------- auto run ------------------- */

  /* ------------------- action ------------------- */

  // 将一个toggle动作移出队列 //
  @action outqueue = (item, oprate) => {
    if (oprate && this.queue[oprate]) {
      const index = this.queue[oprate].indexOf(item);
      if (index !== -1) {
        this.queue[oprate].splice(index, 1);
      }
      // 出队列的同时执行下一个toggle动作
      if (this.queue[oprate].length) this.toggle(this.queue[oprate].pop());
    }
  }

  // 将一个toggle动作放入队列 //
  @action intoqueue = (item, status) => {
    const oprate = status ? 'uninstall' : 'install';
    if (oprate && this.queue[oprate]) {
      if (this.queue[oprate].indexOf(item) === -1) {
        (this.queue[oprate].push(item));
        // 队列中没有任务则直接执行toggle动作
        if (this.queue[oprate].length === 1) this.toggle(item);
      }
    }
  }

  // 改变一项的安装状态 //
  @action toggle = (item) => {
    if (this.items[item] !== undefined) {
      const target = this.items[item] ? 'install-undo.sh' : 'install-do.sh';
      const signal = this.items[item] ? 'install_exec-file.undo' : 'install_exec-file.do';

      // this.loadingMain = true;
      ipcRenderer.send(signal, {
        dir: 'shell',
        target,
        params: [item],
      });
    }
  };


  // 获取最新的安装状态 //
  @action refresh = () => {
    // consoleLog('refresh');
    this.loadingMain = true;
    ipcRenderer.send('install_exec-file.check', {
      dir: 'shell',
      target: 'install-check-multi.sh',
      params: this.totalArray,
    });
    ipcRenderer.send('install_source-check.configure', {
      dir: 'shell',
      target: 'install-configure.sh',
      params: ['--check'],
    });
  };

  // 更新中国的软件源头 //
  @action setSourceCN = () => {
    ipcRenderer.send('install_source-check.configure', {
      dir: 'shell',
      target: 'install-configure.sh',
      params: ['--config'],
    });
  }

  // 更新最新的安装状态 //
  @action update = (installed, uninstalled) => {
    installed && installed.length && installed.forEach( (item) => {
      item && (this.items[item] !== undefined) && (this.items[item] = true);
    });
    uninstalled && uninstalled.length && uninstalled.forEach( (item) => {
      item && (this.items[item] !== undefined) && (this.items[item] = false);
    });
  }

  // 更新一项的安装状态 //
  @action updateOne = (name, status) => {
    status = ( (status === true) || (status === 'true') ) ? true : false;
    ( this.items[name] !== undefined ) && ( this.items[name] = status );
  }

  // 清除terminal info //
  @action clearTerminal = (items) => {
    let allTerms = [];
    if (!Array.isArray(items)) {
      allTerms.push(items);
    } else {
      allTerms = allTerms.concat(items);
    }
    items.forEach((item) => {
      this.terminalInfo[item] = this.defaultTermInfo;
    });
  }

  // 更新terminal info //
  @action updateTerminal = (item, info) => {
    const items = Array.isArray(item) ? item : [item];
    const infos = Array.isArray(info) ? item : [info];
    items.forEach((it, i) => {
      this.terminalInfo[it] = (`${this.terminalInfo[it]}\n${infos[i]}`);
    });
  }
}

export default Install;
