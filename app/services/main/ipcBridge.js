/**
  * ipcBridge [ipc通信连接桥]
  * @author nojsja
  * @param  {[Object]} ipc [main ipc]
  * @param  {[String]} module_name [the target module name to link]
  * @return {[Promise]}  [result]
  */
module.exports = function ipcBridge(ipc, module_name, model) {
  ipc.handle(module_name, async function(event = {}, args = {}) {
    const { action, params } = args;
    const result = await model[action](params).catch((error) => {
      console.error(error);
    });
    return result;
  }); 
  return model;
}