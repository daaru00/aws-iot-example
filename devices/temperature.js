'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Temperature extends Thing{
  constructor(keysPaths, host, debug){
    super("Temperature", keysPaths, host, debug)
  }

  set celsius(value){
    this.update({
      "celsius": value,
      "fahrenheit": value * 9 / 5 + 32,
      "kelvin": value + 273.15
    })
  }

}
