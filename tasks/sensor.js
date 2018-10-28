const cron = require('node-cron');
const config = require('../lib/config.js');
const Gpio = require('pigpio').Gpio;

const motor = new Gpio(config.GPIO_SERVO, {mode: Gpio.OUTPUT});

const Sensor = require("../devices/sensor.js")
var sensor = new Sensor({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

const miHome = require("../lib/mi-home.js");
miHome.load({
  gateway: {
    id: config.MIHOME_GATEWAY,
    token: config.MIHOME_TOKEN
  },
}, {sensor: () => {
  sensor.connect(function () {

    miHome.devices.sensor.state().then((initialState) => {
      sensor.values = {
        temperature: initialState.temperature ? initialState.temperature.value : sensor.state.temperature,
        humidity: initialState.relativeHumidity || sensor.state.humidity,
      }
    });

    cron.schedule('* * * * *', function () {
      Promise.all([
        miHome.getTemperature(sensor.state.temperature),
        miHome.getHumidity(sensor.state.humidity)
      ]).then((results) => {
        const temperature = results[0];
        const humidity = results[1];

        sensor.logger.info('temperature readed', temperature);
        sensor.logger.info('humidity readed', humidity);

        sensor.values = {
          temperature: temperature,
          humidity: humidity,
        }
      }).catch((err) => {
        sensor.logger.error(err);
      })
    });

    sensor.onGoogleHomeActionMode(function (params) {
      sensor.mode = params.thermostatMode;
      if (params.thermostatMode == 'cool') {
        motor.servoWrite(100);
      }else{
        motor.servoWrite(1000);
      }
    })

    let pulseWidth = 1000;
    let increment = 100;

    setInterval(() => {
      motor.servoWrite(pulseWidth);
      pulseWidth += increment;
      if (pulseWidth >= 2000) {
        increment = -100;
      } else if (pulseWidth <= 1000) {
        increment = 100;
      }
    }, 1000);

  })
}})
