/**
 * Created by eatong on 17-3-13.
 */
import {observable, action, computed, toJS} from 'mobx';
import { remote } from 'electron';

class Clean {
  @observable items = {
    'oh-my-zsh': false,
    'git': false,
    'svn': false,
    'Whatever': false,
    'chrome': false,
    'QQ': false,
    'wechat': false
  };

  constructor() {
  }

  @computed get installs() {
    return this.items;
  }

  @action addInstall(title) {
    this.items[tiel] = false;
  }

  @action toggleInstall(index) {
    this.items[index] = !this.items[index];
  }
}
export default Clean;
