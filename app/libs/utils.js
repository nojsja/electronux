const fs = require('fs');

/**
  * loadView [生成可以供直接读取显示到BrowserWindow的html content]
  * @author nojsja
  * @param  {[String]} title [标题]
  * @param  {[String]} script [脚本内容]
  * @return {[String]}
  */
 exports.loadView = ({ title, script, childId="" }) => {
  const htmlContent = (`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
      </head>
      <script>
        window.childId=${childId}
      </script>
      <body>
        <div id="view"></div>
        <script>
        ${script}
        </script>
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