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

  const threshold = 3;
  const host = config.ADMIN_PHONE_HOST;
  var failCount = 0;
  cron.schedule('*/10 * * * * *', function(){
    
    ping.sys.probe(host, function(isAlive){
        modem.logger.debug(isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' not reachable');

        if(isAlive){
          modem.isAminConnected = 1;
          failCount = 0;
        }else{
          if(failCount > threshold){
            modem.isAminConnected = 0;
            modem.logger.info('admin host not found, fail count: '+failCount.toString());
          }else{
            modem.logger.info('admin host not reachable');
            failCount++;
          }
        }
    },{
      timeout: 10
    });

  });


})
