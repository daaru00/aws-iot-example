const cron = require('node-cron');
const config = require('../lib/config.js');

const DHT11 = require("../devices/dht11.js")

var dht11 = new DHT11({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

dht11.connect(function(){
  cron.schedule('* * * * * *', function(){
    dht11.sensorValue = {
      humidity: Math.round(Math.random() * (100 - 0) + 0),
      temperature: Math.round(Math.random() * (40 - 0) + 0)
    }
  });
})
