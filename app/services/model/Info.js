const os = require('os');
const { app } = require('electron');

class Info {
  constructor() {
  }

  static bytesToGB(num) {
    const result = (num / (1024 * 1024 * 1024)).toFixed(2);
    return result;
  }

  static secondsToHour(num) {
    const result = (num / 3600).toFixed(2);
    return result;
  }

  async getCpuInfo() {
    const cpus = await os.cpus();
    return Promise.resolve({
      code: 200,
      result: cpus
    });
  }

  async getMemoryInfo() {
    const freemem = await os.freemem();
    const totalmem = await os.totalmem();
    const ratio = (((totalmem - freemem) / totalmem).toFixed(2)) * 100;

    return Promise.resolve({
      code: 200,
      result: {
        freemem: `${Info.bytesToGB(freemem)} GB`,
        totalmem: `${Info.bytesToGB(totalmem)} GB`,
        ratio,
      }
    });
  }

  async getBasicInfo() {
    const hostname = await os.hostname();
    const release = await os.release();
    const platform = await os.platform();
    const arch = await os.arch();
    const uptime = await os.uptime();

    return Promise.resolve({
      code: 200,
      result: {
        hostname,
        release,
        platform,
        arch,
        uptime: `${Info.secondsToHour(uptime)} h`,
      }
    });
  }

  async getUserInfo() {
    const userInfo = await os.userInfo();

    return Promise.resolve({
      code: 200,
      result: {
        username: userInfo.username,
        homedir: userInfo.homedir,
        shell: userInfo.shell,
      }
    });
  }
}

module.exports = Info;