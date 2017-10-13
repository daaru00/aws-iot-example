const cron = require('node-cron');
const config = require('../lib/config.js');

const Gpio = require('onoff').Gpio;
const port = new Gpio(config.GPIO_LED, 'out');

const Led = require("../devices/led.js")

var led = new Led({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);


led.connect(function(){

  led.onSwitchOn(function(){
    port.writeSync(1);
    led.logger.log('info', 'led on');
  })

  led.onSwitchOff(function(){
    port.writeSync(0);
    led.logger.log('info', 'led off');
  })

})
