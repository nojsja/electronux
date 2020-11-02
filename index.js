const { app } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');

const { readFileSync } = require('./app/utils/write-file');
const { checkEnvFiles } = require('./app/utils/utils');
const requireLang = require('./app/lang');

/* ------------------- Env ------------------- */
global.nodeEnv = process.env.NODE_ENV;
global.pathRuntime = checkEnvFiles().pathRuntime;
const { result, error } = readFileSync(path.join(app.getAppPath(), 'app/runtime/database/setting.json'), true);
requireLang(result ? result.lang : '');

/* ------------------- self module ------------------- */
global.pathLocator = require('./app/utils/path-locator.js');
global.consoleLog = require('./app/utils/console-log.js');
const IpcMainClass = require('./app/services/main/');
const IpcMaiWindowClass = require('./app/services/main/ipcMainWindow');
const fsChmodShell = require('./app/utils/fs-chmod-shell.js');
const ipcInstallListener = require('./app/services/main/ipcInstallListener');


/* ------------------- Middleware ------------------- */
fsChmodShell();
global.ipcMainProcess = new IpcMainClass(ipcMain);
global.ipcMainWindow = new IpcMaiWindowClass();

/* ------------------- Controller ------------------- */
ipcInstallListener(ipcMain);

/* -------------- listener -------------- */

app.on('ready', () => {
  if (global.nodeEnv === 'development') {
    require('source-map-support').install();
  }
  global.ipcMainWindow.createWindow();
});

app.on('window-all-closed', () => {
  console.log('window-all-closed');
  global.ipcMainWindow.writeAppConf().then(() => 0, (err) => {
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
  if (global.ipcMainWindow.window === null) {
    global.ipcMainWindow.createWindow();
  }
});

