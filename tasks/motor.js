const config = require('../lib/config.js');

const Gpio = require('onoff').Gpio;
const port = new Gpio(config.GPIO_MOTOR, 'out');

const Motor = require("../devices/motor.js")

const certs = {
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}
const motor = new Motor(certs, config.HOST, config.DEBUG);

motor.connect(function () {

  motor.onSwitchOn(function () {
    port.writeSync(1);
    motor.logger.info('motor on');
  })

  motor.onSwitchOff(function () {
    port.writeSync(0);
    motor.logger.info('motor off');
  })

  motor.onGoogleHomeAction(function (params) {
    motor.logger.info('Received command from Google:', params);
    motor.active = params.on == true ? 1 : 0;
    if (params.on) {
      port.writeSync(1);
    }else{
      port.writeSync(0);
    }
  })

})
