const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { isEnvDev } = require('./utils');
const MessageChannel = require('../web/libs/MessageChannel.class');

class BrowserService extends BrowserWindow {
  constructor(name, _path, options={}) {
    options.webPreferences = options.webPreferences || {};
    options.webPreferences.preload = path.join(__dirname, 'preload.js');
    super({...options, show: false });

    if (isEnvDev) this.webContents.openDevTools();

    this.serviceReady = false;
    this.exec= _path;
    this.listeners = [];
    this.callbacks = [];
    this.fails = [];
    MessageChannel.registry(name, this.id);
    
    /* state change */
    this.webContents.on('did-finish-load', this.didFinishLoad);
    this.webContents.on('did-fail-load', this.didFailLoad);

    /* load contents immediately */
    this.loadURL(url.format({
      pathname: this.exec,
      protocol: 'file:',
      slashes: true,
    }), {
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });
    
  }

  /* state listeners */
  didFinishLoad = () => {
    this.serviceReady = true;
    this.callbacks.forEach(callback => {
      callback(this.id);
    });
  }

  didFailLoad = (error) => {
    this.serviceReady = false;
    this.fails.forEach(handle => {
      handle(error.toString());
    });
  }

  /* function rewriten */

  loadURL(...params) {
    super.loadURL(...params);
  }

  loadFile(...params) {
    super.loadFile(...params);
  }
  
  /**
    * connect [连接一个render子进程 ]
    * @param  {[windowId]} param [desc]
    * @param  {[Function]} callback [回调]
    */
  connected(callback) {
    if ((callback && !(callback instanceof Function))) throw new Error('Param - callback must be function type!');

    if (this.serviceReady) {
      callback && callback(this.id)
      return Promise.resolve(this.id);
    } else {
      callback && this.callbacks.push(callback);
      return new Promise((resolve, reject) => {
        this.callbacks.push(resolve);
        this.fails.push(reject);
      });
    }
  }
}

module.exports = BrowserService;
