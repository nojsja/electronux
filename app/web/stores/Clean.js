import {
  observable, action, computed, toJS,
} from 'mobx';

import { trim } from '../utils/utils';

const os = require('os');

const { ipcRenderer } = require('electron'); // 渲染进程

class Clean {
  constructor() {
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

  // 清理路径 //
  cleanPaths = {
    appCache: [`/home/${this.userinfo.username}/.cache`],
    appLog: ['/var/log/'],
    trash: [`/home/${this.userinfo.username}/.local/share/Trash/files`],
    packageCache: ['/var/cache/apt/archives'],
  }

  // 路径模块映射 //
  @observable cleanPathMap = {
    appCache: [], // '/var/log/pacman.log'
    appLog: [],
    trash: [],
    packageCache: [],
  }

  // 清理内容 //
  @observable cleanContents = observable.map({})

  // 清理大小 //
  cleanSizes = {
    // '/var/log//pacman.log': '10kb',
  }

  // ---- 清理选项细节-数据对象逻辑树结构 ---- //
  // @observable cleanDetails = {
  //   appCache: {
  //     url: [`/home/${this.userinfo.username}/.cache`], // 指定扫描路径多个
  //     contents: { // 绝对路径
  //       // '/var/cache/pacman/pkg/zsh-5.6.2-1-x86_64.pkg.tar.xz': false,
  //     },
  //     size: {
  //       // '/var/cache/pacman/pkg/zsh-5.6.2-1-x86_64.pkg.tar.xz': '10kb',
  //     },
  //   },
  //   appLog: {
  //     url: ['/var/log/'],
  //     contents: {
  //       // '/var/log//pacman.log': false,
  //     },
  //     size: {
  //       // '/var/log//pacman.log': '10kb',
  //     },
  //   },
  //   trash: {
  //     url: [`/home/${this.userinfo.username}/.local/share/Trash/files`],
  //     contents: {},
  //     size: {
  //       // '/var/log//pacman.log': '10kb',
  //     },
  //   },
  //   packageCache: {
  //     url: ['/var/cache/pacman/pkg'],
  //     contents: {},
  //     size: {
  //       // '/var/log//pacman.log': '10kb',
  //     },
  //   },
  // }

  /* ------------------- static ------------------- */


  /* ------------------- computed ------------------- */

  // 获取所有被选中的detail item //
  @computed get allCheckedDetail() {
    const a = [];
    this.cleanContents.forEach((v, k) => {
      if (v) a.push(k);
    });
    return a;
  }

  // 清理路径详细信息 //
  @computed get cleanDetail() {
    const result = [];
    Object.keys(this.cleanPathMap).forEach((item) => {
      if (this.items[item]) {
        const oneResult = {
          label: item,
          contents: [],
        };
        this.cleanPathMap[item].forEach((it) => {
          oneResult.contents.push({
            content: it,
            size: this.cleanSizes[it] || 0,
          });
        });

        result.push(oneResult);
      }
    });

    return result;
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

  get checkedContents() {
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

  /* 列举和清理所有文件结果 */
  @action listItems = (rsp) => {
    if (rsp.code === 200) {
      if (rsp.result.action === 'du') {
        this.updateDuResult(rsp.result.content, rsp.result.result);
      } else if (rsp.result.action === 'rm') {
        this.lsAllDirs();
      }
    }
  }

  /* 根据路径取得模块名字 */
  @action getHeaderLabel = (str) => {
    let label = '';
    if (!str) {
      return label;
    }
    Object.keys(this.cleanPaths).forEach((path) => {
      if (this.cleanPaths[path].includes(str.trim())) {
        label = `[ ${path} ]`;
      }
    });
    return label;
  }

  // 切换clean detail 项目选中状态 //
  @action toggleDetailOne = (item) => {
    const status = this.cleanContents.get(item);
    if (status !== undefined) {
      this.cleanContents.set(item, !status);
    }
  }

  // 切换clean detail 项目选中状态 //
  @action toggleDetailAll = (content, status) => {
    if (!this.cleanPathMap[content]) return;
    for (let i = 0; i < this.cleanPathMap[content].length; i += 1) {
      this.cleanContents.set(this.cleanPathMap[content][i], status);
    }
  }

  @action toggleChecked = (item) => {
    this.items[item] = !this.items[item];
  }

  // 清除查询缓存数据 //
  @action resetDetails = () => {
    this.cleanContents.clear();
    this.cleanSizes = {};
    Object.keys(this.cleanPathMap).forEach((key) => {
      this.cleanPathMap[key] = [];
    });
  }

  // 开始统计所有需要清理的文件夹 //
  @action lsAllDirs = () => {
    this.loadingMain = true;
    Object.keys(this.cleanPaths).forEach((content) => {
      const url = this.cleanPaths[content];
      const params = {
        content,
        dirs: toJS(url),
        action: 'du',
      };
      this.resetDetails();
      ipcRenderer.invoke('clean', {action: 'handleDirs', params}).then((rsp) => {
        this.loadingMain = false;
        if (rsp.code === 200) {
          this.updateDuResult(rsp.result.content, rsp.result.result);
        }
      });
    });
  }

  // 更新du结果 // 8.0K/home/nojsja/.cache/folks|4.0K/home/nojsja/.cache/obexd
  @action updateDuResult = (content, result) => {
    if (!this.items[content]) return;
    const dirs = result.split('|');
    dirs.forEach((_dir) => {
      const dir = trim(_dir);
      const all = dir.split('/');
      const size = all.shift();
      all.unshift('');
      const item = all.join('/');
      this.cleanContents.set(item, false);
      this.cleanSizes[item] = size;
      if (!this.cleanPathMap[content].includes(item)) {
        this.cleanPathMap[content].push(item);
      }
    });
  }

  // 开始清理所有选中的文件夹 //
  cleanAllDirs = () => {
    this.checkedContents.forEach((content) => {
      const paths = this.cleanPaths[content]; // all clean father path
      const allDirs = this.cleanPathMap[content]
        .filter(con => !paths.includes(con) && this.cleanContents.get(con));
      if (!allDirs.length) return;
      const params = {
        paths,
        content,
        allDirs,
        action: 'rm',
      };
      ipcRenderer.invoke('clean', { action: 'handleDirs', params }).then(this.listItems);
    });
  }
}

export default Clean;
