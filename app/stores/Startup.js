import { observable, action, computed } from 'mobx';
import jsonstr2Ojbect from '../utils/jsonstr2Ojbect';

const { ipcRenderer } = require('electron');
const os = require('os');

class Startup {
  constructor() {
    this.userInfo = os.userInfo();
    this.targetDir = `${this.userInfo.homedir}/.config/autostart`;

    ipcRenderer.on('startup_handle-files_reply', (event, rsp) => {
      console.log(rsp);
      if (rsp.error) {
        return console.log(rsp.error);
      }
      this.updateDetails(rsp.action, rsp.result);
    });
  }

  @observable items = observable.map({
    // "Name_xxx.desktop": 'xxx',
    // "Comment_xxx.desktop": 'xxx',
    // "Exec_xxx.desktop": 'xxx',
  });

  @observable files = observable.array([
  // 'xxx.desktop'
  ]);

  /* ------------------- computed ------------------- */

  @computed get startupDetails() {
    const details = [];
    this.files.forEach((file) => {
      const detail = {
        Name: this.items.get(`Name_${file}`),
        Comment: this.items.get(`Comment_${file}`),
        Exec: this.items.get(`Exec_${file}`),
      };
      details.push(detail);
    });

    return details;
  }

  /* ------------------- action ------------------- */
  @action getDetails = () => {
    ipcRenderer.send('startup_handle-files', {
      dir: this.targetDir,
      action: 'get',
    });
  }

  /* ------------------- 设置启动项参数 ------------------- */
  @action setDetails = ({
    file, Comment, Name, Exec,
  }) => {
    ipcRenderer.send('startup_handle-files', {
      dir: this.targetDir,
      action: 'set',
      detail: {
        file,
        Comment,
        Name,
        Exec,
      },
    });
  }

  @action updateDetails = (_action, _rsp) => {
    const details = jsonstr2Ojbect(_rsp.details);
    const files = _rsp.files.split(' ');
    if (_action === 'get') {
      this.items.replace(details);
      this.files.replace(files);
      console.log(this.files);
      console.log(this.items);
    }
  }
}
export default Startup;
