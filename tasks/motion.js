const config = require('../lib/config.js');

const Motion = require("../devices/motion.js")
var motion = new Motion({
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
}, {motion: () => {
  motion.connect(function () {

    miHome.devices.motion.state().then((initialState) => {
      motion.isInAlarm = initialState.motion == true ? 1 : 0;
    })

    miHome.devices.motion.on('movement', () => {
      if (motion.enabled == 0) return;
      motion.isInAlarm = 1;
    });

    miHome.devices.motion.on('inactivity', () => {
      if (motion.enabled == 0) return;
      motion.isInAlarm = 0;
    });

  })

  motion.onActivated(function () {
    motion.logger.info('motion detected');
    notifier(config.GOOGLEHOME_HOST, config.GOOGLEHOME_LANG).notify(config.GOOGLEHOME_ALARM_MESSAGE)
  })

  motion.onDeactivated(function () {
    motion.logger.info('no motion detected');
    notifier(config.GOOGLEHOME_HOST, config.GOOGLEHOME_LANG).notify(config.GOOGLEHOME_NOALARM_MESSAGE)
  })


  motion.onGoogleHomeAction(function (params) {
    motion.logger.info('Received command from Google:', params);
    motion.enabled = params.on == true ? 1 : 0;
  })

}});
