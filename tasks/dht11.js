const cron = require('node-cron');
const config = require('../lib/config.js');

const sensor = require('node-dht-sensor');
const sensorType = 11; //DHT11

const DHT11 = require("../devices/dht11.js")
var dht11 = new DHT11({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);


dht11.connect(function(){
  cron.schedule('* * * * *', function(){
    sensor.read(sensorType, config.GPIO_DHT11, function(err, temperature, humidity) {
      if (!err) {

        dht11.values = {
          temperature: temperature,
          humidity: humidity,
        }
        dht11.logger.info('temperature readed', temperature);
        dht11.logger.info('humidity readed', humidity);

      }else{
        dht11.logger.error(err);
      }
    });
  });
})
