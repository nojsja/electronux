const fs = require('fs');

/**
  * loadView [生成可以供直接读取显示到BrowserWindow的html content]
  * @author nojsja
  * @param  {[String]} title [标题]
  * @param  {[String]} script [脚本内容]
  * @return {[String]}
  */
 exports.loadView = ({ webSecurity, src, title, script, base = '.' }) => {
  const htmlContent = (`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <base href="${base}"></base>
        <meta charset="UTF-8">
      </head>
      <body>
        <script>
          global.require = require = (function(require) {
            const _require = require;
          
            return function(_path) {
              if (_path === 'electron') return {
                ..._require('electron').remote.require('electron'),
                remote: _require('electron').remote,
                desktopCapturer: _require('electron').desktopCapturer,
                webFrame: _require('electron').webFrame,
                ipcRenderer: _require('electron').ipcRenderer
              };
              try {
                return _require(_path);
              } catch(error) {
                return _require(
                  _require('path').join(
                    document.querySelector('base').href,
                    _path
                  ).replace('file:', '')
                )
              }
            }
          })(require);
        </script>
        ${ webSecurity ? ("<script>" + script + "</script>") : "<script src="+ src + "></script>" }
      </body>
    </html>
  `);
  
  return 'data:text/html;charset=UTF-8,' + encodeURIComponent(htmlContent);
};

/* 开发环境 */
exports.isEnvDev = (
  global.nodeEnv === 'development' ||
  global.nodeEnv === 'development' ||
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'dev'
);