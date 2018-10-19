const io = require('@pm2/io')

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
})

io.metric({
  name: 'Realtime user',
});
require('ts-node/register');
require('./src/main');
