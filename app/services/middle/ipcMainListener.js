const execFile = require(pathLocator('services', 'action/execFile.js'));

function ipcMain(ipc) {
  ipc.on('install_exec-file', function (event, args) {

    const _path = pathLocator(args.dir, args.target);

    execFile(_path, args.params, function (rsp) {
      event.sender.send('install_exec-file-reply', rsp);
    });
  });
};

module.exports = ipcMain;
