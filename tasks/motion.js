const config = require('../lib/config.js');

const Gpio = require('onoff').Gpio;
const port = new Gpio(config.GPIO_MOTION, 'in', 'both');

const Motion = require("../devices/motion.js")
var motion = new Motion({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);


motion.connect(function(){

  port.watch(function (err, value) {
    if (err) {
      motion.logger.error(err);
    }



    motion.logger.log('info', 'motiond reading ', value);
    motion.isInAlarm = parseInt(value);
  });

})

motion.onActivated(function(){
  buzzer.logger.log('info', 'motion detected');
})
motion.onDeactivated(function(){
  buzzer.logger.log('info', 'no motion detected');
})
