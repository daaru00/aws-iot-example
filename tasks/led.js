const config = require('../lib/config.js');

const Gpio = require('onoff').Gpio;
const portGreen = new Gpio(config.GPIO_LED_GREEN, 'out');
const portRed = new Gpio(config.GPIO_LED_RED, 'out');
const portYellow = new Gpio(config.GPIO_LED_YELLOW, 'out');

const Led = require("../devices/led.js")

const certs = {
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}
const led = new Led(certs, config.HOST, config.DEBUG);

led.connect(function () {

  if (led.activeGreen == 1) {
    portGreen.writeSync(1);
  }else{
    portGreen.writeSync(0);
  }
  if (led.activeRed == 1) {
    portRed.writeSync(0);
  }else{
    portRed.writeSync(1);
  }
  if (led.activeYellow == 1) {
    portYellow.writeSync(1);
  }else{
    portYellow.writeSync(0);
  }
  
  if (hubLight.active !== currentState) {
    if (hubLight.active) miHome.devices.light.power(true)
    else  miHome.devices.light.power(false)
    hubLight.active = currentState;
  }

  led.onSwitchOnRed(function () {
    portRed.writeSync(1);
    led.logger.info('led red on');
  })

  led.onSwitchOffRed(function () {
    portRed.writeSync(0);
    led.logger.info('led red off');
  })

  led.onSwitchOnGreen(function () {
    portGreen.writeSync(1);
    led.logger.info('led green on');
  })

  led.onSwitchOffGreen(function () {
    portGreen.writeSync(0);
    led.logger.info('led green off');
  })

  led.onSwitchOnYellow(function () {
    portYellow.writeSync(1);
    led.logger.info('led yellow on');
  })

  led.onSwitchOffYellow(function () {
    portYellow.writeSync(0);
    led.logger.info('led yellow off');
  })

  led.onSwitchOnRed(function () {
    portRed.writeSync(1);
    led.logger.info('led red on');
  })

  led.onGoogleHomeActionGreen(function (params) {
    led.logger.info('Received command from Google:', params);
    led.activeGreen = params.on == true ? 1 : 0;
    if (params.on) {
      portGreen.writeSync(1);
    }else{
      portGreen.writeSync(0);
    }
  })

  led.onGoogleHomeActionRed(function (params) {
    led.logger.info('Received command from Google:', params);
    led.activeRed = params.on == true ? 1 : 0;
    if (params.on) {
      portRed.writeSync(1);
    }else{
      portRed.writeSync(0);
    }
  })

  led.onGoogleHomeActionYellow(function (params) {
    led.logger.info('Received command from Google:', params);
    led.activeYellow = params.on == true ? 1 : 0;
    if (params.on) {
      portYellow.writeSync(1);
    }else{
      portYellow.writeSync(0);
    }
  })

})
