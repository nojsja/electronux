const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const sourceMapSupport = require('source-map-support');
const { ipcMain } = require('electron');

/* ------------------- self module ------------------- */
global.pathLocator = require('./app/utils/path-locator.js');
global.consoleLog = require('./app/utils/console-log.js');
const ipcMainListener = require('./app/services/middleware/ipcMainListener');
const ipcInstallListener = require('./app/services/middleware/ipcInstallListener');
const ipcCleanListener = require('./app/services/middleware/ipcCleanListener');
const viewConf = require('./app/configure/view-conf');

/* ------------------- var ------------------- */
const nodeEnv = process.env.NODE_ENV;
let win;

/* ------------------- ipcMain ------------------- */
ipcInstallListener(ipcMain);
ipcCleanListener(ipcMain);
ipcMainListener(ipcMain);

/* ------------------- func  ------------------- */

// 读取应用设置 //
function getAppConf() {
  let { width, height } = electron.screen.getPrimaryDisplay().workAreaSize; // 硬件参数
  const viewInfo = viewConf.read(); // 用户配置文件

  if (!viewInfo.error && viewInfo.result.width && viewInfo.result.height) {
    width = viewInfo.result.width;
    height = viewInfo.result.height;
    // 存到内存中
    viewConf.set({
      width,
      height,
    });
  } else {
    width *= (3 / 6);
    height *= (4 / 6);
  }

  viewConf.set({
    width, height,
  });

  return {
    width,
    height,
  };
}

// 根据运行环境加载窗口 //
function loadWindow(window, env) {
  if (env === 'development') {
    // wait for webpack-dev-server start
    setTimeout(() => {
      window.loadURL(url.format({
        pathname: 'localhost:3000',
        protocol: 'http:',
        slashes: true,
      }));
      // window.webContents.openDevTools();
    }, 1e3);
  } else {
    window.loadURL(url.format({
      pathname: path.join(path.resolve(__dirname, './dist'), 'index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  }
}

/* ------------------- main window ------------------- */

function createWindow() {
  const { width, height } = getAppConf();
  win = new BrowserWindow({
    width,
    height,
    title: 'electronux',
    autoHideMenuBar: true,
  });

  win.on('resize', () => {
    const [_width, _height] = win.getContentSize();
    viewConf.set({
      width: _width,
      height: _height,
    });
  });

  loadWindow(win, nodeEnv);
}

/* ------------------- electron event ------------------- */

app.on('ready', () => {
  if (nodeEnv === 'development') {
    sourceMapSupport.install();
  }
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('window-all-closed');
  viewConf.write().then(() => 0, (err) => {
    console.error(err);
    throw new Error('App quit: view-conf write error !');
  });
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  console.log('will-quit');
});

app.on('before-quit', () => {
  console.log('before-quit');
});

app.on('quit', () => {
  console.log('quit');
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
