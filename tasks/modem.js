const cron = require('node-cron');
const config = require('../lib/config.js');
const speedTest = require('speedtest-net');
const ping = require('ping');

const Modem = require("../devices/modem.js")
var modem = new Modem({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);


modem.connect(function(){
  cron.schedule('*/5 * * * *', function(){

    speedTest({maxTime: 5000}).on('data', data => {

      var info = {
        "download": data.speeds.download,
        "upload": data.speeds.upload,
        "publicIP": data.client.ip
      }
      modem.info = info;

      modem.logger.info('internet info', info);

    }).on('error', err => {
      modem.logger.error(err);
    });

  });

  cron.schedule('*/10 * * * * *', function(){

    var host = config.ADMIN_PHONE_HOST;
    ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        modem.logger.info(msg);

        if(isAlive){
          modem.isAminConnected = 1;
        }else{
          modem.isAminConnected = 0;
        }
    });

  });


})
