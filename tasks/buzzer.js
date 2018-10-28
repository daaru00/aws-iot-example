const config = require('../lib/config.js');

const Gpio = require('onoff').Gpio;
const port = new Gpio(config.GPIO_BUZZER, 'out');

const Buzzer = require("../devices/buzzer")
var buzzer = new Buzzer({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);


buzzer.connect(function(){

  buzzer.onRing(function(data){
    buzzer.logger.info('buzzer ringing');
    port.writeSync(1);

    var value = 1;
    var ringing = setInterval(function(){
      port.writeSync(value);
      value = value == 1 ? 0 : 1;
    }, 100);

    if(data != undefined && typeof data.timeout == 'number'){
      setTimeout(function(){
        buzzer.logger.info('buzzer stop ringing');
        port.writeSync(0);
        clearInterval(ringing);
      }, data.timeout)
    }
  })

  buzzer.onStopRing(function(){
    buzzer.logger.info('buzzer stop ringing');
    port.writeSync(0);
  })


  buzzer.onGoogleHomeAction(function (params) {
    buzzer.logger.info('Received command from Google:', params);
    if (params.on == true) {
      buzzer.ring();
    }else{
      buzzer.stopRing();
    }
  })

})
