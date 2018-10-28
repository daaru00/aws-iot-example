'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Sensor extends Thing{
  constructor(keysPaths, host, debug){
    super("Door", keysPaths, host, debug)
  }

  set isOpen(value){
    if(value != this.state.isOpen){
      if(value == 1){
        this.send("door-opened");
      }else{
        this.send("door-closed");
      }
      this.update({
        "isOpen": value
      })
    }
  }

  get isOpen(){
    return this.state.isOpen || 0;
  }

  onOpened(callback){
    this.on("door-opened", callback)
  }

  onClosed(callback){
    this.on("door-closed", callback)
  }
}
