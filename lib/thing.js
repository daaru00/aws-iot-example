'use strict';

const awsIot = require('aws-iot-device-sdk');
const logger = require('./logger.js');

module.exports = class Thing{

  constructor(thingName, keysPaths, host, debug){
    this.thingName = thingName;
    this.keyPath = keysPaths.privateKey;
    this.certPath = keysPaths.clientCert;
    this.caPath = keysPaths.caCert;
    this.host = host;
    this.connected = false;

    this.logger = logger({
      level: debug == "true" ? 'debug' : 'info',
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: true
    });

    this.state = {}
  }

  connect(callback){
    this.thingShadows = awsIot.thingShadow({
      keyPath: this.keyPath,
      certPath: this.certPath,
      caPath: this.caPath,
      clientId: this.thingName,
      host: this.host
    });
    let self = this;

    this.thingShadows.on('connect', function() {
        self.thingShadows.register(self.thingName, {
          ignoreDeltas: true,
          enableVersioning: false
        }, function() {
            self.logger.log('info', 'connection with '+self.thingName+' opened');
            callback(null)
        });
    });
    this.thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
      self.logger.log('debug', 'received '+stat+' on '+thingName, stateObject);
      self.state = stateObject;
    });

    this.thingShadows.on('timeout', function(thingName, clientToken) {
      self.logger.error('received timeout on '+thingName+' with token: '+ clientToken);
    });
  }

  disconnect(callback){
    this.thingShadows.disconnect()
    let self = this;

    this.thingShadows.on('close', function() {
      self.logger.log('info', 'connection with '+self.thingName+' closed');
      callback(null)
    });
  }

  update(data){
    this.thingShadows.update(this.thingName, {"state":{"desired": data }});
  }

}
