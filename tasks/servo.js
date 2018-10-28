const config = require('../lib/config.js');

const Gpio = require('onoff').Gpio;
const port = new Gpio(config.GPIO_SERVO, {mode: Gpio.OUTPUT});

const Servo = require("../devices/servo.js")

const certs = {
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}
const servo = new Servo(certs, config.HOST, config.DEBUG);

servo.connect(function () {

  servo.onChangePosition(function (position) {
    port.servoWrite(position);
    servo.logger.info('servo on positiorn '+position);
  })

  servo.onGoogleHomeAction(function (params) {
    servo.logger.info('Received command from Google:', params);
    //port.servoWrite(position);
  })

})
