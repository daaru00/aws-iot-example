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
    this.onStatusChange = null;

    this.logger = logger({
      level: debug == "true" ? 'debug' : 'info',
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: true
    });

    this.state = {};
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
          enableVersioning: false
        }, function() {
            self.logger.info('connection with '+self.thingName+' opened');
            self.thingShadows.get(self.thingName);
        });
    });

    this.thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
      self.logger.log('debug', 'received '+stat+' on '+thingName, stateObject);
      if (Object.keys(self.state).length == 0) callback(null);
      self.state = Object.assign(self.state, stateObject.state ? stateObject.state.reported : {});
    });

    this.thingShadows.on('delta', function(thingName, stateObject) {
      self.logger.log('debug', 'received delta on '+thingName, stateObject);
      self.state = Object.assign(self.state, stateObject.state);
      self.ack();
    });

    this.thingShadows.on('timeout', function(thingName, clientToken) {
      self.logger.error('received timeout on '+thingName+' with token: '+ clientToken);
    });
  }

  disconnect(callback){
    this.thingShadows.disconnect()
    let self = this;

    this.thingShadows.on('close', function() {
      self.logger.info('connection with '+self.thingName+' closed');
      callback(null)
    });
  }

  update(data){
    this.logger.log('debug', 'updating state with data ', data);
    this.thingShadows.update(this.thingName, {
      "state":{
        "reported": data
      }
    });
  }

  ack(){
    var self = this;
    this.logger.log('debug', 'ack ', self.state);
    this.thingShadows.update(this.thingName, {
      "state":{
        "desired": null,
        "reported": self.state
      }
    });
  }

  send(topic, message){
    this.logger.log('debug', 'sending event '+topic, message);
    this.thingShadows.publish(topic, message)
  }

  on(topic, callback){
    let self = this;
    this.thingShadows.subscribe(topic, function(err, granted){
      if(err){
        self.logger.error(err);
      }else{
        self.logger.log('debug', 'connected on topic '+topic);

        self.thingShadows.on('message', function(messageTopic, message){
          if(messageTopic == topic){
            if(IsValidJSON(message)){
              callback(JSON.parse(message));
            }else{
              callback(message);
            }
          }
        })
      }
    })
  }

  onChange(callback){
    let self = this;

    this.thingShadows.on('delta', function(thingName, stateObject) {
      callback(stateObject.state)
    });
  }
}

function IsValidJSON(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}
