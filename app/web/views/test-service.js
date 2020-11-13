const msgc = require('../libs/MessageChannel.class');

module.exports = () => {

  msgc.send('app', 'service-event', `some-data: child`);

  msgc.invoke('app', 'service-handle', { value: 'child' }).then((rsp) => {
    console.log(`invoke-callback: ${rsp}`);
  });
  
  msgc.on('service-callback', (event, result) => {
    console.log(`service-callback: ${result}`);
  });

  msgc.handle('render-handle', (event, result) => {
    console.log('render-handle: ', result);
    return Promise.resolve('render-handle-value');
  });

}