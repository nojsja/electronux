import { observable, computed, action } from 'mobx';

const { ipcRenderer } = require('electron');

class Info {
  @observable cpuInfo = observable.array([])

  @observable memoryInfo = {
    freemem: '',
    totalmem: '',
    ratio: '',
  }

  @observable userInfo = {
    username: '',
    homedir: '',
    shell: '',
  }

  @observable basicInfo = {
    hostname: '',
    release: '',
    platform: '',
    arch: '',
    uptime: '',
  }

  /* ------------------- computed ------------------- */

  @computed get cpus() {
    return this.cpuInfo.map(c => ({
      name: c.model,
      speed: `${c.speed} Mhz`,
    }));
  }

  /* ------------------- action ------------------- */

  @action getTotal = () => {
    this.getCpuInfo();
    this.getMemoryInfo();
    this.getUserInfo();
    this.getBasicInfo();
  }

  @action getCpuInfo = () => {
    ipcRenderer.invoke('info', {
      action: 'getCpuInfo',
      params: ''
    })
    .then((rsp) => {
      if (rsp.code === 200) {
        this.cpuInfo.replace(rsp.result);
      }
    });
  }

  @action getMemoryInfo = () => {
    ipcRenderer.invoke('info', {
      action: 'getMemoryInfo',
      params: ''
    })
    .then((rsp) => {
      console.log(rsp);
      if (rsp.code === 200) {
        Object.keys(rsp.result).forEach((k) => {
          this.memoryInfo[k] = rsp.result[k];
        });
      }
    });
  }

  @action getUserInfo = () => {
    ipcRenderer.invoke('info', {
      action: 'getMemoryInfo',
      params: ''
    })
    .then((rsp) => {
      if (rsp.code === 200) {
        Object.keys(rsp.result).forEach((k) => {
          this.userInfo[k] = rsp.result[k];
        });
      }
    });
  }

  @action getBasicInfo = () => {
    ipcRenderer.invoke('info', {
      action: 'getMemoryInfo',
      params: ''
    })
    .then((rsp) => {
      if (rsp.code === 200) {
        Object.keys(rsp.result).forEach((k) => {
          this.basicInfo[k] = rsp.result[k];
        });
      }
    });
  }
}

export default Info;
