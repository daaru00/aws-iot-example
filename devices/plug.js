'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Plug extends Thing{
  constructor(keysPaths, host, debug){
    super("Plug", keysPaths, host, debug)
  }

  get active(){
    return this.state.on || 0;
  }

  onSwitchOn(callback){
    this.onChange(function(state){
      if(state.on == 1){
        callback();
      }
    })
  }

  onSwitchOff(callback){
    this.onChange(function(state){
      if(state.on == 0){
        callback();
      }
    })
  }

}
