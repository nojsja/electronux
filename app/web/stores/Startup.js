import { observable, action, computed } from 'mobx';
import { jsonstr2Object } from '../utils/utils';
import codeMessage from '../utils/code-message';

const { ipcRenderer } = require('electron');
const os = require('os');

class Startup {
  constructor() {
    this.userInfo = os.userInfo();
    this.targetDir = `${this.userInfo.homedir}/.config/autostart`;
  }

  // 读取到的文件属性 //
  @observable items = observable.map({
    // "Name_xxx.desktop": 'xxx',
    // "Comment_xxx.desktop": 'xxx',
    // "Exec_xxx.desktop": 'xxx',
  });

  // 原生的启动文件图标地址 //
  @observable icon = ''

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
    ipcRenderer.invoke('startup', {
      action: 'getStartupConfig',
      params: {
        dir: this.targetDir
      }
    })
    .then(rsp => {
      if (rsp.code !== 200) return;
      if (rsp.result.error) {
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.result.error.code || 1),
          body: `ERROR: " ${rsp.result.error.cmd || rsp.result.error.toString()} "`,
        });
      } else {
        const details = jsonstr2Object(rsp.result.details);
        const files = rsp.result.files.split(' ');
        this.icon = rsp.result.iconPath;
        this.items.replace(details);
        this.files.replace(files);
      }
    });
  }

  @action setModal = (status) => {
    this.modal = status;
  }

  // 设置启动项参数
  @action setDetails = ({
    file, Comment, Name, Exec, Hidden,
  }) => {
    console.log({
      dir: this.targetDir,
      detail: {
        dir: this.targetDir,
        file,
        Comment,
        Name,
        Exec,
        Hidden: Hidden || false,
      },
    });
    ipcRenderer.invoke('startup', {
      action: 'modifyStartupConfig',
      params: {
        dir: this.targetDir,
        detail: {
          dir: this.targetDir,
          file,
          Comment,
          Name,
          Exec,
          Hidden: Hidden || false,
        },
      }
    })
    .then((rsp) => {
      if (rsp.code !== 200) return;
      if (rsp.result.error) {
        console.log(rsp.result.error);
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.result.error.code || 1),
          body: `ERROR: " ${rsp.result.error.cmd || rsp.result.error.toString()} "`,
        });
      } else {
        this.getDetails();
      }

    });
  }

  // 删除启动项
  @action deleteDetail = (file) => {
    ipcRenderer.invoke('startup', {
      action: 'deleteStartupItem',
      params: {
        dir: this.targetDir,
        file,
      }
    })
    .then((rsp) => {
      if (rsp.code !== 200) return;
      if (rsp.result.error) {
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.result.error.code || 1),
          body: `ERROR: " ${rsp.result.error.cmd || rsp.result.error.toString()} "`,
        });
      } else {
        this.getDetails();
      }
    });
  }

  // 添加启动项
  @action addDetail = ({ Name, Comment, Exec }) => {
    ipcRenderer.invoke('startup', {
      action: 'addStartupItem',
      params: {
        dir: this.targetDir,
        file: `${Name}.desktop`,
        detail: {
          Name,
          Comment,
          Exec,
        },
      }
    })
    .then(rsp => {
      if (rsp.code !== 200) return;
      if (rsp.result.error) {
        ipcRenderer.send('notify-send', {
          title: codeMessage('shell', rsp.result.error.code || 1),
          body: `ERROR: " ${rsp.result.error.cmd || rsp.result.error.toString()} "`,
        });
      } else {
        this.setModal(false);
        this.getDetails();
      }
    });
  }
}
export default Startup;
