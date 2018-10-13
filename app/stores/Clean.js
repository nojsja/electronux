import { observable, action, computed, toJS } from 'mobx';

const os = require('os');
const fs = require('fs');

const { ipcRenderer } = require('electron'); // 渲染进程

class Clean {
  constructor() {
    // 列举和清理所有文件结果 //
    ipcRenderer.on('clean_handle-dirs_replay', (event, rsp) => {
      console.log(rsp);
      if (rsp.action === 'du') {
        this.updateDuResult(rsp.content, rsp.result);
      } else if (rsp.action === 'rm') {
        this.updateRmResult(rsp.content, rsp.result);
      }
    });
  }

  /* ------------------- static ------------------- */
  userinfo = os.userInfo()

  /* ------------------- observable ------------------- */

  // 所有检查项目 //
  @observable items = {
    appCache: false,
    appLog: false,
    trash: false,
    packageCache: false,
  };

  // 主界面加载 //
  @observable loadingMain = false;

  // 清理选项细节 //
  @observable cleanDetails = {
    appCache: {
      url: [`/home/${this.userinfo.username}/.cache`], // 指定扫描路径多个
      contents: { // 绝对路径
        // '/var/cache/pacman/pkg/zsh-5.6.2-1-x86_64.pkg.tar.xz': false,
      },
      size: {
        // '/var/cache/pacman/pkg/zsh-5.6.2-1-x86_64.pkg.tar.xz': '10kb',
      },
    },
    appLog: {
      url: ['/var/log/'],
      contents: {
        // '/var/log//pacman.log': false,
      },
      size: {
        // '/var/log//pacman.log': '10kb',
      },
    },
    trash: {
      url: [`/home/${this.userinfo.username}/.local/share/Trash/files`],
      contents: {},
      size: {
        // '/var/log//pacman.log': '10kb',
      },
    },
    packageCache: {
      url: ['/var/cache/pacman/pkg'],
      contents: {},
      size: {
        // '/var/log//pacman.log': '10kb',
      },
    },
  }

  /* ------------------- static ------------------- */


  /* ------------------- computed ------------------- */

  // 清理路径详细信息 //
  @computed get cleanDetail() {
    // return Object.keys(this.items).filter(item => this.items[item]).map((content) => {
    //   let item = this.cleanDetails[content];
    //   item = Object.keys(item.contents).map(it => ({
    //     content: it,
    //     size: item.size[it],
    //     checked: item.contents[it],
    //   }));
    //   return {
    //     label: content,
    //     contents: item,
    //   };
    // });

    return Object.keys(this.cleanDetails).filter(detail => this.items[detail]).map((content) => {
      const item = Object.keys(this.cleanDetails[content].contents).map(it => ({
        content: it,
        size: this.cleanDetails[content].size[it],
        checked: this.cleanDetails[content].contents[it],
      }));
      return {
        label: content,
        contents: item,
      };
    });
  }

  @computed get totalArray() {
    return Object.keys(this.items).map(item => item);
  }

  @computed get total() {
    const dir = 'resources/clean';

    return Object.keys(this.items).map(item => ({
      label: item,
      url: [dir, (`${item}.png`)].join('/'),
      checked: this.items[item],
    }));
  }

  @computed get allChecked() {
    let allChecked = true;
    Object.keys(this.items).forEach((item) => {
      if (!this.items[item]) {
        allChecked = false;
      }
    });
    return allChecked;
  }

  @computed get checkedContents() {
    return Object.keys(this.items).filter(item => this.items[item]);
  }

  /* ------------------- action ------------------- */

  @action toggleAllChecked = () => {
    if (this.allChecked) {
      Object.keys(this.items).forEach((item) => {
        this.items[item] = false;
      });
    } else {
      Object.keys(this.items).forEach((item) => {
        this.items[item] = true;
      });
    }
  }

  @action toggleChecked = (item) => {
    this.items[item] = !this.items[item];
  }

  // 开始统计所有需要清理的文件夹 //
  @action lsAllDirs = () => {
    this.checkedContents.forEach((content) => {
      const { url } = this.cleanDetails[content];
      const params = {
        content,
        dirs: toJS(url),
        action: 'du',
      };
      ipcRenderer.send('clean_handle-dirs', params);
    });
  }

  // 更新du结果 // 8.0K/home/nojsja/.cache/folks|4.0K/home/nojsja/.cache/obexd
  @action updateDuResult = (content, _result) => {
    if (!this.cleanDetails[content]) return;
    const dirs = _result.split('|');
    dirs.forEach((_dir) => {
      const all = _dir.split('/');
      const size = all.shift();
      all.unshift(' ');
      const item = all.join('/');
      this.cleanDetails[content].contents[item] = false;
      this.cleanDetails[content].size[item] = size;
    });
  }

  // 开始清理所有选中的文件夹 //
  @action cleanAllDirs = () => {
    this.checkedContents.forEach((content) => {
      let paths = this.cleanDetails[content].contents;
      paths = Object.keys(paths).filter((item) => paths[item])
      let params = {
        content,
        paths,
        action: 'rm',
      };
      ipcRenderer.send('clean_handle-dirs', params);
    });
  }
}

export default Clean;
