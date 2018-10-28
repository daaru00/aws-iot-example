'use strict';

const Thing = require("../lib/thing.js")

module.exports = class HUBLight extends Thing{
  constructor(keysPaths, host, debug){
    super("Motor", keysPaths, host, debug)
  }

  get active(){
    return this.state.active || 0;
  }

  set active(value){
    if(value != this.state.active){
      this.update({
        "active": value
      })
    }
  }

  onSwitchOn(callback){
    this.onChange(function(state){
      if(state.active == 1){
        callback();
      }
    })
  }

  onSwitchOff(callback){
    this.onChange(function(state){
      if(state.active == 0){
        callback();
      }
    })
  }

  onGoogleHomeAction(callback){
    this.on("motor-action", callback)
  }
}
