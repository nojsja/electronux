const nodeEnv = process.env.NODE_ENV;
const path = require('path');

const pathLocator = function (module, name) {
  const _path = {
    stores: 'app/stores',
    services: 'app/services',
    shell: 'app/services/shell',
    styles: 'app/styles',
    utils: 'app/utils',
    views: 'app/views',
    resources: 'resources'
  };
  let abpath = _path[module] ? (_path[module]+`/${name}`) : '';

  return path.resolve(abpath);
};

module.exports = pathLocator;
