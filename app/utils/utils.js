
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
  const check = function ({_path, isDir, exec}) {
    if (!fs.existsSync(_path)) {
      if (isDir) {
        fs.mkdirSync(_path);
        exec && exec();
      } else {
        fs.closeSync(fs.openSync(_path, 'w'));
      }
    }
  };
  [
    { _path: appDataPath, isDir: true },
    { _path: pathRuntime, isDir: true },
    { _path: path.join(pathRuntime, 'view.conf'), isDir: false },
    { _path: path.join(pathRuntime, 'password.conf'), isDir: false },
    { _path: path.join(pathRuntime, 'database/'), isDir: true },
    { _path: path.join(pathRuntime, 'scripts'), isDir: true, exec: () => {
      exports.copyDir(path.join(app.getAppPath(), 'app/services/scripts'), path.join(pathRuntime, 'scripts'));
    } },
    { _path: path.join(pathRuntime, 'database/setting.json'), isDir: false },
  ].forEach((info) => {
    check(info);
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

/*
 * 同步复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
exports.copyDir = (src, dist, callback) => {
  let paths;
  if(!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
  }

  _copy(null, src, dist);

  function _copy(src, dist) {
    paths = fs.readdirSync(src);
    paths.forEach(function(_path) {
        let _src = path.join(src, _path);
        let _dist = path.join(dist, _path);
        stat = fs.statSync(_src);
        // 判断是文件还是目录
        if(stat.isFile()) {
          fs.writeFileSync(_dist, fs.readFileSync(_src));
        } else if(stat.isDirectory()) {
          // 当是目录是，递归复制
          copyDir(_src, _dist, callback)
        }
    })
  }
}

/*
 * 异步复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
exports.copyDirAsync = (src, dist, callback) => {
  fs.access(dist, function(err){
    if(err){
      // 目录不存在时创建目录
      fs.mkdirSync(dist);
    }
    _copy(null, src, dist);
  });

  function _copy(err, src, dist) {
    if(err){
      callback(err);
    } else {
      fs.readdir(src, function(err, paths) {
        if(err){
          callback(err)
        } else {
          paths.forEach(function(path) {
            var _src = src + '/' +path;
            var _dist = dist + '/' +path;
            fs.stat(_src, function(err, stat) {
              if(err){LOCALHOST
                callback(err);
              } else {
                // 判断是文件还是目录
                if(stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src));
                } else if(stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _dist, callback)
                }
              }
            })
          })
        }
      })
    }
  }
}
