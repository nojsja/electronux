/**
 * Created by nojsja on 17-3-13.
 */
import {observable, action, computed, autorun, toJS} from 'mobx';
import { remote } from 'electron';
const path = require('path');

import consoleLog from '../utils/console-log.js';

const { ipcRenderer } = require('electron');  // 渲染进程

class Install {
  @observable items = {  // 所有安装项
    'oh-my-zsh': false,
    'node': false,
    'atom': false,
    'vscode': false,
    'chrome': false,
    'wechat': false,
    'deepin-capture': false,
    'deepin-terminal': false,
    'peek': false,
    'easeMusic': false,
    'QQ': false,
    'albert': false,
    'whatever': false,
  };

  @observable loadingMain = true;  // 主界面加载
  @observable queue = { // 任务执行队列
    install: [],
    uninstall: []
  }

  constructor() {
    const that = this;

    /* ------------------- ipc render ------------------- */

    // 检查脚本文件事件 //
    ipcRenderer.on('install_exec-file_reply.check', (event, rsp) => {
      this.loadingMain = false;
      if (rsp.error) {
        console.log(rsp.error);
      }else {
        consoleLog('install.check: ', rsp.result);
        let all = rsp.result.split('|');
        let installed = all.shift().split(' ');
        let uninstalled = all.shift().split(' ');
        that.update(installed, uninstalled);
      }
    });

    // 安装脚本文件事件 //
    ipcRenderer.on('install_exec-file_reply.do', (event, rsp) => {
      // this.loadingMain = false;
      rsp.params.forEach( (item) => {
        this.outqueue(item, 'install');
      });
      if (rsp.error) {
        console.log(rsp.error);
      }else {
        consoleLog('install.do: ', rsp.result);
        rsp.params.forEach(function (name) {
          that.updateOne(name, true);
        });
      }
    });

    // 卸载脚本文件事件 //
    ipcRenderer.on('install_exec-file_reply.undo', (event, rsp) => {
      // this.loadingMain = false;
      rsp.params.forEach( (item) => {
        this.outqueue(item, 'uninstall');
      });
      if (rsp.error) {
        console.log(rsp.error);
      }else {
        consoleLog('install.undo: ', rsp.result);
        rsp.params.forEach(function (name) {
          that.updateOne(name, false);
        });
      }
    });

  }

  /* ------------------- computed ------------------- */

  // 安装项数组 //
  @computed get totalArray() {
    return Object.keys(this.items).map( item => item )
  }

  // 获取所有安装项 //
  @computed get total() {
    let items = this.items;
    let _dir = 'resources/install';

    return Object.keys(items).map( item => ({
      label: item,
      status: items[item],
      url: [_dir, (item+'.png')].join('/')
    }) );
  }

  // 获取所有已安装项 //
  @computed get installed() {
    return Object.keys(this.items).filter((item) => {
      return this.items[item];
    });
  }

  // 获取所有未安装项 //
  @computed get uninstalled() {
    return Object.keys(this.items).filter((item) => {
      return !this.items[item];
    });
  }

  /* ------------------- auto run ------------------- */

  /* ------------------- action ------------------- */

  // 将一个toggle动作移出队列 //
  @action outqueue = (item, action) => {
    if (action && this.queue[action]) {
      let index = this.queue[action].indexOf(item);
      if (index !== -1) {
        this.queue[action].splice(index, 1);
      }
      // 出队列的同时执行下一个toggle动作
      (this.queue[action].length) && ( this.toggle(this.queue[action].pop()) );
    }
  }

  // 将一个toggle动作放入队列 //
  @action intoqueue = (item, status) => {
    let action = status ? 'uninstall' : 'install';
    if (action && this.queue[action]) {
      if (this.queue[action].indexOf(item) === -1) {
        (this.queue[action].push(item));
        // 队列中没有任务则直接执行toggle动作
        (this.queue[action].length === 1) && ( this.toggle(item) );
      }
    }
  }

  // 改变一项的安装状态 //
  @action toggle = (item) => {
    if ( this.items[item] !== undefined ) {

      let target = this.items[item] ? 'install-undo.sh' : 'install-do.sh';
      let signal = this.items[item] ? 'install_exec-file.undo' : 'install_exec-file.do';

      // this.loadingMain = true;
      ipcRenderer.send(signal, {
        dir: 'shell',
        target,
        params: [item]
      });
    }
  }


  // 获取最新的安装状态 //
  @action refresh = () => {
    consoleLog('refresh');
    this.loadingMain = true;
    ipcRenderer.send('install_exec-file.check', {
      dir: 'shell',
      target: 'install-check.sh',
      params: this.totalArray
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
    status = status ? true : false;
    ( this.items[name] !== undefined ) && ( this.items[name] = status );
  }
}

export default Install;
