const cron = require('node-cron');
const config = require('../lib/config.js');

const Led = require("../devices/led.js")

var led = new Led({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

led.connect(function(){

  led.onSwitchOn(function(){
    led.logger.log('info', 'led on');
  })

  led.onSwitchOff(function(){
    led.logger.log('info', 'led off');
  })

})
