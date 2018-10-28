const config = require('../lib/config.js');

const Plug = require("../devices/plug.js")
var plug = new Plug({
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
}, {plug: () => {
  plug.connect(function () {

    miHome.devices.plug.state().then((initialState) => {
      const currentState = initialState.power == true ? 1 : 0
      if (hubLight.active !== currentState) {
        if (hubLight.active) miHome.devices.plug.power(true)
        else  miHome.devices.plug.power(false)
        hubLight.active = currentState;
      }
    })

    plug.onGoogleHomeAction(function (params) {
      plug.logger.info('Received command from Google:', params);
      plug.active = params.on == true ? 1 : 0;
      if (params.on) {
        miHome.devices.plug.power(true)
      }else{
        miHome.devices.plug.power(false)
      }
    })

  })
}})
