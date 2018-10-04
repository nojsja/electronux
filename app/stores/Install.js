/**
 * Created by eatong on 17-3-13.
 */
import {observable, action, computed, toJS} from 'mobx';
import { remote } from 'electron';

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
  }

  @computed get total() {
    let items = this.items;
    let _dir = 'resources/install';

    return Object.keys(items).map( item => ({
      label: item,
      status: items[item],
      url: [_dir, (item+'.png')].join('/')
    }) );
  }

  @computed get installed() {
    return Object.keys(this.items).filter((item) => {
      return this.items[item];
    });
  }

  @computed get uninstalled() {
    return Object.keys(this.items).filter((item) => {
      return !this.items[item];
    });
  }

  @action toggle = (item) => {
    ( this.items[item] !== undefined ) && ( this.items[item] = !this.items[item] );
  }
}

export default Install;
