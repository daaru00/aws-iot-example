'use strict';
// Devices

const Temperature = require("./devices/temperature.js")
const Humidity = require("./devices/humidity.js")
const Motion = require("./devices/motion.js")

// Settings
const dotenv = require('dotenv').config()
if (dotenv.error) {
  throw dotenv.error
}
const config = dotenv.parsed;

const host = config.HOST;
const keys = {
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}
const debug = config.DEBUG

// Temperature
var temp = new Temperature(keys, host, debug);
temp.connect(function(){
  setInterval(function(){
    temp.celsius = Math.round(Math.random() * (40 - 0) + 0);
  }, 5000)
})

// Humidity
var hum = new Humidity(keys, host, debug);
hum.connect(function(){
  setInterval(function(){
    hum.percentage =  Math.random() * (100 - 0) + 0;
  }, 5000)
})

// Motion
var motion = new Motion(keys, host, debug);
motion.connect(function(){
  setInterval(function(){
    motion.active =  Math.round(Math.random());
  }, 5000)
})
