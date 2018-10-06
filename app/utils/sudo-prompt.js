/**
* @name: sudo-prompt
* @description: 调用系统弹窗组件申请权限执行脚本或命令
*/

const child = require('child_process');
const fs = require('fs');

class SudoPrompt {
  constructor(){
    this.bins = [
      '/usr/bin/pkexec',
      '/usr/bin/gksu',
    ];
    this.bin = null;
  }

  // 识别系统权限弹窗获取程序
  getBin() {
    if (this.bin) return this.bin;

    for (let i = 0; i < this.bins.length; i++) {
        if (fs.existsSync(this.bins[i])) {
          this.bin = this.bins[i];
          break;
        }
    }
    return this.bin;
  }

  /**
   * [exec 执行一个命令]
   * @param  { [String] }  command    [命令]
   * @param  { [Array | String] }   params  [参数数组]
   * @param  { [Object] }  options [exec可定制的参数]
   * @return { Promise }           [返回Promise对象]
   */
  async exec(command, params, options) {
    let self = this;
    self.getBin();
    params = Array.isArray(params) ? params.join(' ') : params;
    options = (typeof(options) === 'object') ? options : {};
    command = `${command} ${params}`;

    return new Promise(async (resolve, reject) => {
      child.exec(command, options, (err, stdout, stderr) => {
        if (err || stderr) {
          err = err ? err : stderr;
          reject(err);
        }else {
          resolve(stdout);
        }
      });
    });
  }

  /**
   * [execFile 执行一个脚本文件]
   * @param  { [String] }  path    [脚本路径]
   * @param  { [Array | String] }   params  [参数数组]
   * @param  { [Object] }  options [exec可定制的参数]
   * @return { Promise }           [返回Promise对象]
   */
  async execFile(path, params, options) {
    let self = this;
    self.getBin();
    params = Array.isArray(params) ? params.join(' ') : params;
    options = (typeof(options) === 'object') ? options : {};
    let command = `${self.bin} ${path} ${params}`;

    return new Promise(async (resolve, reject) => {
      child.exec(command, options, (err, stdout, stderr) => {
        if (err || stderr) {
          err = err ? err : stderr;
          reject(err);
        }else {
          resolve(stdout);
        }
      });
    });
  }
}

module.exports = SudoPrompt;
