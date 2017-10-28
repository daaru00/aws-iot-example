const config = require('../lib/config.js');
const duration = require('parse-duration');
const debounceDelay = duration(config.MOTION_DEBOUNCE_DELAY);

const Gpio = require('onoff').Gpio;
const port = new Gpio(config.GPIO_MOTION, 'in', 'both');

const Motion = require("../devices/motion.js")
var motion = new Motion({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

var timeout = null;

function stopAlarm(){
  motion.logger.info('motion not yet in alarm, notifing');
  motion.isInAlarm = 0;
}

motion.connect(function(){

  port.watch(function (err, value) {
    if (err) {
      motion.logger.error(err);
    }else{
      value = parseInt(value);
      if(value == 1){
        if(motion.isInAlarm == 1){
          motion.logger.info('motion already in alarm');
        }else{
          motion.logger.info('motion in alarm, notifing');
          motion.isInAlarm = 1;
        }
        if(timeout != null) clearTimeout(timeout);
        timeout = setTimeout(stopAlarm, debounceDelay);
      }
    }

  });

})

motion.onActivated(function(){
  motion.logger.info('motion detected');
})
motion.onDeactivated(function(){
  motion.logger.info('no motion detected');
})
