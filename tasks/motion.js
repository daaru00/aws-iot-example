const config = require('../lib/config.js');

const Motion = require("../devices/motion.js")
const Buzzer = require("../devices/buzzer")

// Buzzer

var buzzer = new Buzzer({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

// Motion sensor

var motion = new Motion({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

var testValues = [
  0,0,0,1,0,0,0,1
]

buzzer.connect(function(){
  motion.connect(function(){

    function readTestValue(i){
      if(i == testValues.length){
        readTestValue(0)
      }else{
        var alarmState = testValues[i];
        motion.logger.info("reading "+alarmState);
        motion.isInAlarm = alarmState;
        setTimeout(function(){
          readTestValue(++i);
        }, 1000)
      }
    }
    readTestValue(0);

  })

  motion.onActivated(function(){
    buzzer.logger.log('info', 'motion detected');
    buzzer.ring(2000);
  })
  motion.onDeactivated(function(){
    buzzer.logger.log('info', 'no motion detected');
    buzzer.stopRing();
  })

})

buzzer.onRing(function(){
  buzzer.logger.log('info', 'ringing');
})

buzzer.onStopRing(function(){
  buzzer.logger.log('info', 'stop ringing');
})
