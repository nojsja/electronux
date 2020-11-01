
const { Notification } = require('electron');
const fs = require('fs');

const fsPromises = fs.promises;
const path = require('path');
const { app } = require('electron');


/**
* @name: jsonstr2Object
* @description: 去除shell返回的json字符串内容的最后一个','符号，并转化成对象
*/
exports.jsonstr2Object = function (_str) {
  let str = _str;

  try {
    str = str.substr(0, (str.length - 1));
    str = `{${str}}`;
    str = JSON.parse(str);
  } catch (e) {
    str = '{}';
    console.error(e);
  }

  return str;
};

/**
* @name: notifySend
* @description: 桌面通知发送
*/
exports.notifySend = function ({
  title, body, icon, delay,
}) {
  const notify = new Notification({
    title,
    body,
    icon,
  });

  if (delay) {
    setTimeout(() => {
      notify.show();
    }, delay);
  } else {
    notify.show();
  }
};


/**
  * checkEnvFiles [检查环境文件是否存在]
  * @author nojsja
  * @return {[type]} param [desc]
  */
 exports.checkEnvFiles = function () {
  const appDataPath = path.join(app.getPath('appData'), 'electronux');
  const pathRuntime = path.join(appDataPath, 'runtime/');
  const check = function (_path, isDir) {
    if (!fs.existsSync(_path)) {
      if (isDir) {
        fs.mkdirSync(_path);
      } else {
        fs.closeSync(fs.openSync(_path, 'w'));
      }
    }
  };
  [
    { _path: appDataPath, isDir: true },
    { _path: pathRuntime, isDir: true },
    { _path: path.join(pathRuntime, 'view.conf'), isDir: false },
    { _path: path.join(pathRuntime, 'database/'), isDir: true },
    { _path: path.join(pathRuntime, 'database/setting.json'), isDir: false },
  ].forEach(({ _path, isDir }) => {
    check(_path, isDir);
  });

  return {
    pathRuntime,
  };
};

/* 转换真值 */
exports.boolValue = (str) => {
  if (str === 'true') {
    return true;
  }
  if (str === 'false') {
    return false;
  }
  if (str === '') {
    return false;
  }
  return str;
}

/* str trim */
exports.trim = (str) => {
  if (!str) {
    return '';
  }
  if (str.trim) {
    return str.trim();
  }
  return '';
}
