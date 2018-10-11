
import { observable, action, computed } from 'mobx';

class Clean {
  @observable items = {
    appCache: false,
    appLog: false,
    trash: false,
    packageCache: false,
  };

  @observable loadingMain = false; // 主界面加载


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
}

export default Clean;
