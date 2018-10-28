const config = require('../lib/config.js');

const Gpio = require('onoff').Gpio;
const port1 = new Gpio(config.GPIO_BUTTON1, 'in', 'both');
const port2 = new Gpio(config.GPIO_BUTTON2, 'in', 'both');

const Button1 = require("../devices/button1.js")
const Button2 = require("../devices/button2.js")
const certs = {
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}
const button1 = new Button1(certs, config.HOST, config.DEBUG);
const button2 = new Button2(certs, config.HOST, config.DEBUG);

initButton(button1, port1)
initButton(button2, port2)

function initButton(button, port) {
  button.connect(function(){ 
    port.watch(function (err, value) { 
      if (err) { 
        button.logger.error(err); 
      } 
      if(value == 1){ 
        button.logger.info('button pressed'); 
        button.click(); 
      } 
    }); 
  }) 
}
