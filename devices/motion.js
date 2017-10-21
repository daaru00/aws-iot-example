'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Motion extends Thing{
  constructor(keysPaths, host, debug){
    super("Motion", keysPaths, host, debug)
  }

  set isInAlarm(value){
    if(this.state.enable == 1){

      if(value != this.state.isInAlarm){
        if(value == 1){
          this.send("motion-acivated");
        }else{
          this.send("motion-deactivated");
        }
      }
      
      this.update({
        "isInAlarm": value
      })

    }else{
      this.logger.info("sensor disabled, value not updated");
    }
  }

  get isInAlarm(){
    return this.state.isInAlarm || 0;
  }

  get enable(){
    return this.state.enable || 0;
  }

  onActivated(callback){
    this.on("motion-acivated", callback)
  }

  onDeactivated(callback){
    this.on("motion-deactivated", callback)
  }

}
