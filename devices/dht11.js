'use strict';

const Thing = require("../lib/thing.js")

module.exports = class DHT11 extends Thing{
  constructor(keysPaths, host, debug){
    super("DHT11", keysPaths, host, debug)
  }

  set humidity(value){
    this.update({
      "humidity": value
    })
  }

  set temperature(value){
    this.update({
      "temperature": value
    })
  }

  get humidity(){
    return this.state.humidity || 0;
  }

  get temperature(){
    return this.state.temperature || 0;
  }
}
