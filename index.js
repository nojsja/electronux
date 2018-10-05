/**
 * Created by eatong on 17-3-14.
 */
const electron = require('electron');
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const nodeEnv = process.env.NODE_ENV;
const { ipcMain } = require('electron');

global.pathLocator = require('./app/utils/path-locator.js');

const ipcMainListener = require('./app/services/middle/ipcMainListener')

let win;

app.on('ready', () => {

  if (nodeEnv === 'development') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

/* ------------------- ipcMain ------------------- */
ipcMainListener(ipcMain);

function createWindow() {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  console.log(width, height);
   win = new BrowserWindow({
     width: width*(3/6),
     height: height*(4/6),
     title: 'electronux'
   });

  if (nodeEnv === 'development') {
    //delay 1000ms to wait for webpack-dev-server start
    setTimeout(function(){
      win.loadURL(url.format({
        pathname: "localhost:3000",
        protocol: 'http:',
        slashes: true
      }));
      win.webContents.openDevTools();
    },1000);
  } else {
    win.loadURL(url.format({
      pathname: path.join(path.resolve(__dirname, './dist'), 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
}
