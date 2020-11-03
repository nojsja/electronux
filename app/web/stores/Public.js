import { observable, action } from 'mobx';

const { shell } = require('electron');
const { ipcRenderer } = require('electron'); // 渲染进程

class Public {
  constructor() {
    ipcRenderer.on('public_password-read_replay', (event, rsp) => {
      console.log(rsp);
      if (!rsp.result) {
        this.state.settingPage = true;
      } else {
        this.state.password = rsp.result;
      }
    });
  }

  @observable state = {
    activeItem: 'install',
    navActivate: true,
    settingPage: false,
    password: '',
    total: ['install', 'startup', 'clean', 'info', 'blogs'],
  }

  @action setPassword = (passwd) => {
    ipcRenderer.send('public_password', {
      action: 'set',
      password: passwd,
    });
    this.state.password = passwd;
  }

  @action checkPassword = () => {
    ipcRenderer.send('public_password', {
      action: 'read',
    });
  }

  @action setSettingPage = (status) => {
    this.state.settingPage = status;
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
