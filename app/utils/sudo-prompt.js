/**
* @name: sudo-prompt
* @description: 调用系统弹窗组件申请权限执行脚本或命令
*/

const child = require('child_process');
const fs = require('fs');

class SudoPrompt {
  constructor() {
    this.bins = [
      '/usr/bin/pkexec',
      '/usr/bin/gksu',
    ];
    this.bin = null;
  }

  // 识别系统权限弹窗获取程序
  getBin() {
    if (this.bin) return this.bin;

    for (let i = 0; i < this.bins.length; i += 1) {
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
  async exec(_command, _params, _options) {
    const self = this;
    self.getBin();
    const params = Array.isArray(_params) ? _params.join(' ') : _params;
    const options = (typeof (_options) === 'object') ? _options : {};
    const command = `${self.bin} ${_command} ${params}`;

    return new Promise(async (resolve, reject) => {
      child.exec(command, options, (_err, _stdout, _stderr) => {
        if (_err || _stderr) {
          const err = !_err ? _stderr : _err;
          reject(err);
        } else {
          resolve(_stdout);
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
  async execFile(_path, _params, _options) {
    const self = this;
    self.getBin();
    const params = Array.isArray(_params) ? _params.join(' ') : _params;
    const options = (typeof (_options) === 'object') ? _options : {};
    const command = `${self.bin} ${_path} ${params}`;

    return new Promise(async (resolve, reject) => {
      child.exec(command, options, (_err, _stdout, _stderr) => {
        if (_err || _stderr) {
          const err = !_err ? _stderr : _err;
          reject(err);
        } else {
          resolve(_stdout);
        }
      });
    });
  }

  /**
   * [exec 执行一个命令]
   * @param  { [String] }  command    [命令]
   * @param  { [Array] }   params  [参数数组]
   * @param  { [Object] }  options [exec可定制的参数]
   * @return { Promise }           [返回Promise对象]
   */
  async spawn({
    _command, _params, _options, _stdout, _stderr, _close,
  }) {
    const self = this;
    self.getBin();
    const params = Array.isArray(_params) ? _params : [_params];
    params.unshift(_command);
    const options = (typeof (_options) === 'object') ? _options : {};
    const command = self.bin;

    const childSpawn = child.spawn(command, params, options);

    // data output
    childSpawn.stdout.on('data', (d) => {
      _stdout(d.toString());
    });

    // err output
    childSpawn.stderr.on('data', (d) => {
      console.log('sudo stderr: ', d.toString());
      _stderr(d.toString());
    });

    // process exit
    childSpawn.on('close', (code) => {
      console.log('sudo close: ', code);
      _close(code);
    });
  }
}

module.exports = SudoPrompt;
