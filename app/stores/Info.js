import { observable, computed, action } from 'mobx';

const { remote } = require('electron');

const {
  cpu, memory, basic, user,
} = remote.require('./app/services/render-serv/info');

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
    cpu().then((r) => {
      this.cpuInfo.replace(r);
    });
  }

  @action getMemoryInfo = () => {
    memory().then((meminfo) => {
      Object.keys(meminfo).forEach((k) => {
        this.memoryInfo[k] = meminfo[k];
      });
    });
  }

  @action getUserInfo = () => {
    user().then((useri) => {
      Object.keys(useri).forEach((k) => {
        this.userInfo[k] = useri[k];
      });
    });
  }

  @action getBasicInfo = () => {
    basic().then((basici) => {
      Object.keys(basici).forEach((k) => {
        this.basicInfo[k] = basici[k];
      });
    });
  }
}

export default Info;
