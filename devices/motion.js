'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Motion extends Thing{
  constructor(keysPaths, host, debug){
    super("Motion", keysPaths, host, debug)
  }

  set enable(value){
    this.update({
      "enable": value,
      "isInAlarm": this.state.isInAlarm || 0
    })
  }

  set isInAlarm(value){
    this.update({
      "enable": this.state.enable || 0,
      "isInAlarm": value
    })
  }

  get enable(){
    return this.state.enable || 1;
  }

  get isInAlarm(){
    return this.state.isInAlarm || 0;
  }

  onActivated(callback){
    var self = this;
    this.onChange(function(state){
      if(typeof state.isInAlarm != undefined && self.isInAlarm == 1){
        callback()
      }
    })
  }

  onDeactivated(callback){
    this.onChange(function(state){
      if(typeof state.isInAlarm != undefined && state.isInAlarm == 0){
        callback()
      }
    })
  }

}
