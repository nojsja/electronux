
import { observable, action, computed } from 'mobx';

class Clean {
  @observable items = {
    'oh-my-zsh': false,
    git: false,
    svn: false,
    Whatever: false,
    chrome: false,
    QQ: false,
    wechat: false,
  };

  @computed get installs() {
    return this.items;
  }

  @action addInstall(title) {
    this.items[title] = false;
  }

  @action toggleInstall(index) {
    this.items[index] = !this.items[index];
  }
}
export default Clean;
