import { observable, action } from 'mobx';

const { shell } = require('electron');
const { ipcRenderer } = require('electron'); // 渲染进程

class Public {
  @observable state = {
    activeItem: 'install',
    navActivate: true,
    total: ['install', 'startup', 'clean', 'info'],
  }

  @action openExternalLink = (link) => {
    shell.openExternal(link);
  }

  @action setActiveItem = (name) => {
    this.state.activeItem = name;
  }

  @action toggleNavActivate = () => {
    this.state.navActivate = !this.state.navActivate;
  }
}
export default Public;
