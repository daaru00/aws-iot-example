'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Buzzer extends Thing{
  constructor(keysPaths, host, debug){
    super("Buzzer", keysPaths, host, debug)
  }

  ring(timeout){
    if(this.state.ringing == 0 || this.state.ringing == undefined){
      this.send("buzzer-ring");
      this.update({
        "ringing": 1
      })
    }
  }

  onRing(callback){
    this.on("buzzer-ring", callback)
  }

  stopRing(){
    if(this.state.ringing == 1){
      this.send("buzzer-stop-ring");
      this.update({
        "ringing": 0
      })
    }
  }

  onStopRing(callback){
    this.on("buzzer-stop-ring", callback)
  }

}
