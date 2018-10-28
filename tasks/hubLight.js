const config = require('../lib/config.js');

const HUBLight = require("../devices/hubLight.js")
var hubLight = new HUBLight({
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
}, {light: () => {
  hubLight.connect(function () {

    miHome.devices.light.state().then((initialState) => {
      const currentState = initialState.power == true ? 1 : 0
      if (hubLight.active !== currentState) {
        if (hubLight.active) miHome.devices.light.power(true)
        else  miHome.devices.light.power(false)
        hubLight.active = currentState;
      }
    })

    hubLight.onGoogleHomeAction(function (params) {
      hubLight.logger.info('Received command from Google:', params);
      hubLight.active = params.on == true ? 1 : 0;
      if (params.on) {
        miHome.devices.light.power(true)
      }else{
        miHome.devices.light.power(false)
      }
    })

  })
}})
