const config = require('../lib/config.js');

const DoorSensor = require("../devices/door.js")
var doorSensor = new DoorSensor({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

const notifier = require('../lib/google-home-notifier');

const miHome = require("../lib/mi-home.js");
miHome.load({
  gateway: {
    id: config.MIHOME_GATEWAY,
    token: config.MIHOME_TOKEN
  },
}, {door: () => {
  doorSensor.connect(function () {

    miHome.devices.door.isOpen().then((value) => {
      doorSensor.isOpen = value == true ? 1 : 0;
    })

    miHome.devices.door.on('contactDetectedChanged', (value) => {
      console.log('contactDetectedChanged', value)
      doorSensor.isOpen = value == true ? 0 : 1;
    });

    miHome.devices.door.on('opened', () => {
      console.log('opened')
      doorSensor.isOpen = 1;
    });

  })

  doorSensor.onOpened(function () {
    doorSensor.logger.info('door opened');
    notifier(config.GOOGLEHOME_HOST, config.GOOGLEHOME_LANG).notify(config.GOOGLEHOME_DOOR_MESSAGE)
  })
  doorSensor.onClosed(function () {
    doorSensor.logger.info('door cosed');
  })
}});
