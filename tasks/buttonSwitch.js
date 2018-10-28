const config = require('../lib/config.js'); 
 
const Gpio = require('onoff').Gpio; 
const port = new Gpio(config.GPIO_BUTTON, 'in', 'both'); 
 
const Button = require("../devices/buttonSwitch.js") 
var button = new Button({ 
  "privateKey": config.PRIVATE_KEY, 
  "clientCert": config.CLIENT_CERT, 
  "caCert": config.CA_CERT, 
}, config.HOST, config.DEBUG); 
 
button.connect(function(){ 
 
  port.watch(function (err, value) { 
    if (err) { 
      button.logger.error(err); 
    } 
    if(value == 1){ 
      button.logger.info('button switch pressed'); 
      button.click(); 
    } 
  }); 
 
}) 
