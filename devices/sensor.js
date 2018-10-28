'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Sensor extends Thing{
  constructor(keysPaths, host, debug){
    super("DHT11", keysPaths, host, debug)
  }

  set values(value){
    this.update({
      "humidity": value.humidity,
      "temperature": value.temperature
    })
  }

  get humidity(){
    return this.state.humidity || 0;
  }

  get temperature(){
    return this.state.temperature || 0;
  }
}
