import { observable, action, computed } from 'mobx';
const { ipcRenderer } = require('electron');
const os = require('os');

class Startup {

  constructor() {
    this.userInfo = `${os.userInfo()}`;
    this.targetDir = `${this.userInfo.homedir}/.config/autostart`;

    ipcRenderer.on('startup_handle-files_reply', (event, rsp) => {
      console.log(rsp);
      updateDetails(rsp);
    });
  }

  @observable items = {
    // "Name_xxx.desktop": 'xxx',
    // "Comment_xxx.desktop": 'xxx',
    // "Exec_xxx.desktop": 'xxx',
  };

  @observable files = [
  // 'xxx.desktop'
  ];

  @computed get startupDetails() {
    return this.items;
  }

  @action getDetails() {
    ipcRenderer.send('startup_handle-files');
  }

  @action updateDetails(rsp) {

  }
}
export default Startup;
