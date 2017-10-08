'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Button extends Thing{
  constructor(keysPaths, host, debug){
    super("Button", keysPaths, host, debug)
  }

  click(){
    this.send("button-click")
  }

  onClick(callback){
    this.on("button-click", callback)
  }

}
