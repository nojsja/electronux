
const { execFile } = require('child_process');
const fs = require('fs');

/**
 * [_execFile 执行文件]
 * @param       {[String]}   path     [执行文件路径]
 * @param       {Function}   callback [执行结果会回调函数]
 * @return      {[Object]}            [返回结果对象]
 * @param       {[Array]}    params   [执行携带参数]
 */
function ExecFile(_path, params, callback) {
  if (!fs.existsSync(_path)) return callback({
    error: new Error(`path - ${_path} not exists!`)
  });
  try {
    let error = '';
    let result = '';
    execFile(_path, params, (err, stdout, stderr) => {
      if (err || stderr) {
        error = !err ? stderr : err;
        console.error(error);
      }
      result = stdout;
      callback({
        error,
        result,
      });
    });
  } catch (e) {
    console.error(e);
    throw new Error(`exec file -> ${_path} error !`);
  }
}


module.exports = ExecFile;
