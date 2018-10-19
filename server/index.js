const io = require('@pm2/io')

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
})
require('ts-node/register');
require('./src/main');
