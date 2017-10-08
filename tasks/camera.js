const cron = require('node-cron');
const config = require('../lib/config.js');

const Camera = require("../devices/camera.js")
const Button = require("../devices/button.js")

var camera = new Camera({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

var button = new Button({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

camera.connect(function(){

  camera.onPhoto(function(){
    camera.logger.log('info', 'shooting photo');
  })

  button.connect(function(){
    button.onClick(function(){
      button.logger.log('info', 'button clicked');
      camera.photo();
    })

    button.click();
  })

})
