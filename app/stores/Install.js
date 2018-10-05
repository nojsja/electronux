/**
 * Created by eatong on 17-3-13.
 */
import {observable, action, computed, toJS} from 'mobx';
import { remote } from 'electron';

import pathLocator from '../utils/path-locator';

const { ipcRenderer } = require('electron');  // 渲染进程

const path = require('path');

class Install {
  @observable items = {
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

  constructor() {
    const that = this;

    // 执行脚本返回事件
    ipcRenderer.on('install_exec-file-reply', (event, rsp) => {
      if (rsp.error) {
        console.log(rsp.error);
      }else {
        let all = rsp.result.split('|');
        let installed = all.shift().split(' ');
        let uninstalled = all.shift().split(' ');
        that.update(installed, uninstalled);
      }
    });

  }

  // 安装项数组
  @computed get totalArray() {
    return Object.keys(this.items).map( item => item )
  }

  // 获取所有安装项
  @computed get total() {
    let items = this.items;
    let _dir = 'resources/install';

    return Object.keys(items).map( item => ({
      label: item,
      status: items[item],
      url: [_dir, (item+'.png')].join('/')
    }) );
  }

  // 获取所有已安装项
  @computed get installed() {
    return Object.keys(this.items).filter((item) => {
      return this.items[item];
    });
  }

  // 获取所有未安装项
  @computed get uninstalled() {
    return Object.keys(this.items).filter((item) => {
      return !this.items[item];
    });
  }

  // 改变一项的安装状态
  @action toggle = (item) => {
    ( this.items[item] !== undefined ) && ( this.items[item] = !this.items[item] );
  }

  // 获取最新的安装状态
  @action refresh = () => {
    console.log('refresh');
    ipcRenderer.send('install_exec-file', {
      dir: 'shell',
      target: 'install-check.sh',
      params: this.totalArray
    })

  }

  // 更新最新的安装状态
  @action update = (installed, uninstalled) => {
    installed && installed.length && installed.forEach( (item) => {
      item && (this.items[item] !== undefined) && (this.items[item] = true);
    });
    uninstalled && uninstalled.length && uninstalled.forEach( (item) => {
      item && (this.items[item] !== undefined) && (this.items[item] = false);
    });
  }
}

export default Install;
