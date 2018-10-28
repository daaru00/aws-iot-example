'use strict';

const Thing = require("../lib/thing.js")

module.exports = class HUBLight extends Thing{
  constructor(keysPaths, host, debug){
    super("Hub", keysPaths, host, debug)
  }

  get active(){
    return this.state.light || 0;
  }

  set active(value){
    if(value != this.state.light){
      this.update({
        "light": value
      })
    }
  }

  onSwitchOn(callback){
    this.onChange(function(state){
      if(state.light == 1){
        callback();
      }
    })
  }

  onSwitchOff(callback){
    this.onChange(function(state){
      if(state.light == 0){
        callback();
      }
    })
  }

  onGoogleHomeAction(callback){
    this.on("hublight-action", callback)
  }
}
