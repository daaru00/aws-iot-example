'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Motion extends Thing{
  constructor(keysPaths, host, debug){
    super("Motion", keysPaths, host, debug)
  }

  set active(value){
    this.update({
      "active": value
    })
  }

}
