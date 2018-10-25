import { observable, action, computed } from 'mobx';
import jsonstr2Ojbect from '../utils/jsonstr2Ojbect';
import codeMessage from '../configure/code-message';

const { ipcRenderer } = require('electron');
const os = require('os');

class Startup {
  constructor() {
    this.userInfo = os.userInfo();
    this.targetDir = `${this.userInfo.homedir}/.config/autostart`;

    // 修改文件 //
    ipcRenderer.on('startup_handle-files_reply', (event, rsp) => {
      if (rsp.error) {
        console.log(rsp.error);
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code || 1),
          body: `ERROR: " ${rsp.error.cmd} "`,
        });
      } else {
        if (rsp.action === 'set') {
          ipcRenderer.send('notify-send', {
            title: 'startup',
            body: 'set startup success!',
          });
        }
        this.updateDetails(rsp.action, rsp.result);
      }
    });

    // 删除文件 //
    ipcRenderer.on('startup_delete-files_reply', (event, rsp) => {
      if (rsp.error) {
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code || 1),
          body: `ERROR: " ${rsp.error.cmd} "`,
        });
      } else {
        this.getDetails();
      }
    });

    // 添加文件 //
    ipcRenderer.on('startup_add-files_reply', (event, rsp) => {
      if (rsp.error) {
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.error.code || 1),
          body: `ERROR: " ${rsp.error.cmd} "`,
        });
      } else {
        this.setModal(false);
        this.getDetails();
      }
    });
  }

  // 读取到的文件属性 //
  @observable items = observable.map({
    // "Name_xxx.desktop": 'xxx',
    // "Comment_xxx.desktop": 'xxx',
    // "Exec_xxx.desktop": 'xxx',
  });

  // 所有启动文件 //
  @observable files = observable.array([
  // 'xxx.desktop'
  ]);

  // modal显示和隐藏 //
  @observable modal = false

  /* ------------------- computed ------------------- */

  @computed get startupDetails() {
    const details = [];
    this.files.forEach((file) => {
      const detail = {
        Name: this.items.get(`Name_${file}`),
        Comment: this.items.get(`Comment_${file}`),
        Exec: this.items.get(`Exec_${file}`),
        Hidden: this.items.get(`Hidden_${file}`),
        file,
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

  @action setModal = (status) => {
    this.modal = status;
  }

  // 设置启动项参数
  @action setDetails = ({
    file, Comment, Name, Exec, Hidden,
  }) => {
    ipcRenderer.send('startup_handle-files', {
      dir: this.targetDir,
      action: 'set',
      detail: {
        dir: this.targetDir,
        file,
        Comment,
        Name,
        Exec,
        Hidden: Hidden || false,
      },
    });
  }

  // 删除启动项
  @action deleteDetail = (file) => {
    ipcRenderer.send('startup_delete-files', {
      dir: this.targetDir,
      file,
    });
  }

  // 添加启动项
  @action addDetail = ({ Name, Comment, Exec }) => {
    ipcRenderer.send('startup_add-files', {
      dir: this.targetDir,
      file: `${Name}.desktop`,
      detail: {
        Name,
        Comment,
        Exec,
      },
    });
  }

  @action updateDetails = (_action, _rsp) => {
    if (_action === 'get') {
      const details = jsonstr2Ojbect(_rsp.details);
      const files = _rsp.files.split(' ');
      this.items.replace(details);
      this.files.replace(files);
    } else if (_action === 'set') {
      this.getDetails();
    }
  }
}
export default Startup;
