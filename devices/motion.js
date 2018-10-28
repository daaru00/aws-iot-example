'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Motion extends Thing{
  constructor(keysPaths, host, debug){
    super("Motion", keysPaths, host, debug)
  }

  set isInAlarm(value){
    if(value != this.state.isInAlarm){
      if(value == 1){
        this.send("motion-acivated");
      }else{
        this.send("motion-deactivated");
      }
      this.update({
        "isInAlarm": value
      })
    }
  }

  set enabled(value){
    if(value != this.state.enabled){
      this.update({
        "enabled": value
      })
    }
  }

  get isInAlarm(){
    return this.state.isInAlarm || 0;
  }

  get enabled(){
    return this.state.enabled || 0;
  }

  onActivated(callback){
    this.on("motion-acivated", callback)
  }

  onDeactivated(callback){
    this.on("motion-deactivated", callback)
  }

  onGoogleHomeAction(callback){
    this.on("motion-action", callback)
  }

}
