
const { execFile } = require('child_process');

/**
 * [_execFile description]
 * @param       {[String]}   path     [执行文件路径]
 * @param       {[Array]}   params   [执行携带参数]
 * @param       {Function} callback [执行结果会回调函数]
 * @return      {[Object]}            [返回结果对象]
 */
function _execFile(path, params, callback) {
  let _path = path;

  try {
    let _err = '';
    let _result = '';
    execFile(_path, params, (err, stdout, stderr) => {
      if (err || stderr) {
        err = err ? err : stderr;
        _err = err;
        console.error(_err);
      }
      _result = stdout;

      callback({
        error: _err,
        result: _result
      });

    });

  } catch (e) {
    console.error(e);
  }
}

module.exports = _execFile;
