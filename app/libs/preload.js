global.require = (function(require) {
  const _require = require;

  return function(_path) {
    if (_path === 'electron') return {
      ..._require('electron').remote.require('electron'),
      remote: _require('electron').remote,
      desktopCapturer: _require('electron').desktopCapturer,
      webFrame: _require('electron').webFrame,
      ipcRenderer: _require('electron').ipcRenderer
    };
    return _require(_path);
  }
})(require);