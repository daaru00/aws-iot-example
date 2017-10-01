const cron = require('node-cron');
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


buzzer.connect(function(){
  motion.connect(function(){
    /*
    cron.schedule('* * * * * *', function(){
      if(motion.enable){
        var alarmState = Math.floor(Math.random() * 2);
        motion.logger.info("reading "+alarmState);
        motion.isInAlarm = alarmState;
      }
    });*/
    cron.schedule('*/10 * * * * *', function(){
      if(motion.enable){
        motion.isInAlarm = 0;
        motion.logger.info(0);
        setTimeout(function () {
          motion.isInAlarm = 1;
          motion.logger.info(1);
          setTimeout(function () {
            motion.isInAlarm = 0;
            motion.logger.info(0);
            setTimeout(function () {
              motion.isInAlarm = 0;
              motion.logger.info(0);
              setTimeout(function () {
                motion.isInAlarm = 0;
                motion.logger.info(0);
              }, 2000);
            }, 2000);
          }, 4000);
        }, 2000);
      }else{
        motion.logger.info("disabled");
      }
    })
  })

  motion.onActivated(function(){
    buzzer.logger.log('info', 'motion detected');
    //buzzer.ring();
  })
  motion.onDeactivated(function(){
    buzzer.logger.log('info', 'no motion detected');
    //buzzer.stopRing();
  })

})

buzzer.onRing(function(){
  buzzer.logger.log('info', 'ringing');
})

buzzer.onStopRing(function(){
  buzzer.logger.log('info', 'stop ringing');
})
