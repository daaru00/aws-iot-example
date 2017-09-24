'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Humidity extends Thing{
  constructor(keysPaths, host, debug){
    super("Humidity", keysPaths, host, debug)
  }

  set percentage(value){
    this.update({
      "percentage": value
    })
  }
}
