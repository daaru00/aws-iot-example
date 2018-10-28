'use strict';

const Thing = require("../lib/thing.js")

module.exports = class HUBLight extends Thing{
  constructor(keysPaths, host, debug){
    super("Servo", keysPaths, host, debug)
  }

  get position(){
    return this.state.position || 0;
  }

  set position(value){
    if(value != this.state.position){
      this.update({
        "position": value
      })
    }
  }

  onChangePosition(callback){
    this.onChange(function(state){
      callback(state.position);
    })
  }

  onGoogleHomeAction(callback){
    this.on("servo-action", callback)
  }
}
