const fs = require('fs');
const path = require('path');

const confPath = path.resolve(process.cwd(), 'app/configure/view.conf');

let viewConf = {
  width: null,
  height: null,
};

/**
 * [set 在内存中设置窗口属性]
 * @param {[Object]} props [属性描述]
 */
const set = (props) => {
  const isObject = (typeof (props) === 'object');
  if (isObject) {
    viewConf = Object.assign(viewConf, props);
  }
};

/**
 * [write 从内存中读取数值并写入.conf文件]
 * @return {[type]} [description]
 */
function write() {
  const data = JSON.stringify(viewConf);
  return new Promise((resolve, reject) => {
    fs.writeFile(confPath, data, 'utf8', (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve('');
      }
    });
  });
}

/**
 * [write 从.conf文件中读取数值并存到内存中]
 * @return {[type]} [description]
 */
function read() {
  const result = fs.readFileSync(confPath, {
    encoding: 'utf8',
  });
  const isError = result instanceof Error;

  if (isError) {
    return {
      result: null,
      error: result,
    };
  }
  return {
    result: JSON.parse(result),
    error: null,
  };
}

module.exports = Object.assign(viewConf, {
  set,
  write,
  read,
});
