'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Buzzer extends Thing{
  constructor(keysPaths, host, debug){
    super("Buzzer", keysPaths, host, debug)
  }

  ring(timeout){
    var self = this;
    if(self.state.ringing == 0 || self.state.ringing == undefined){
      self.send("buzzer-ring");
      self.update({
        "ringing": 1
      })
      setTimeout(function(){
        self.stopRing();
      }, timeout)
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
