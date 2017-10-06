'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Led extends Thing{
  constructor(keysPaths, host, debug){
    super("Led", keysPaths, host, debug)
  }

  get active(){
    return this.state.active || 0;
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

}
