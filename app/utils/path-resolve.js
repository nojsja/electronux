const nodeEnv = process.env.NODE_ENV;
const path = require('path');

const pathResolve = function (params) {
  if (nodeEnv === 'developments') {
    let _path = ['http://localhost:3000'].concat(params).join('/');
    return _path;
  }else {
    return path.resolve(...params);
  }

};

export default pathResolve;
