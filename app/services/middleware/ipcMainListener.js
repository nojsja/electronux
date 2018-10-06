const execFile = require(pathLocator('utils', 'exec-file.js'));

function ipcMain(ipc) {

  ipc.on('install_exec-file.check', function (event, args) {

    const _path = pathLocator(args.dir, args.target);
    execFile(_path, args.params, function (rsp) {
      event.sender.send('install_exec-file_reply.check', rsp);
    });
  });

  ipc.on('install_exec-file.do', function (event, args) {

    const _path = pathLocator(args.dir, args.target);
    execFile(_path, args.params, function (rsp) {
      rsp.params = args.params;
      event.sender.send('install_exec-file_reply.do', rsp);
    });
  });

  ipc.on('install_exec-file.undo', function (event, args) {

    const _path = pathLocator(args.dir, args.target);
    execFile(_path, args.params, function (rsp) {
      rsp.params = args.params;
      event.sender.send('install_exec-file_reply.undo', rsp);
    });
  });

};

module.exports = ipcMain;
