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
  door: {
    id: config.MIHOME_GATEWAY,
    token: config.MIHOME_TOKEN
  },
}, {motion: () => {
  doorSensor.connect(function () {

    miHome.devices.door.isOpen().then((value) => {
      doorSensor.isOpen = value == true ? 1 : 0;
    })

    miHome.devices.door.on('contactDetectedChanged', (value) => {
      doorSensor.isOpen = value == true ? 1 : 0;
    });

  })

  doorSensor.onOpened(function () {
    motion.logger.info('door opened');
    notifier(config.GOOGLEHOME_HOST, config.GOOGLEHOME_LANG).notify(config.GOOGLEHOME_DOOR_MESSAGE)
  })
  doorSensor.onClosed(function () {
    motion.logger.info('door cosed');
  })
}});
