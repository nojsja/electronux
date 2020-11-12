const { invoke, send, on } = require('../libs/MessageChannel.class');

module.exports = () => {
  let i = 0;
  setInterval(() => {
    send('app', 'service-event', `some-data: ${i++}`);
  }, 1000);
  
  on('service-callback', (event, result) => {
    console.log(`service-callback: ${result}`);
  });
}