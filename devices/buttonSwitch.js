'use strict'; 
 
const Thing = require("../lib/thing.js") 
 
module.exports = class Button extends Thing{ 
  constructor(keysPaths, host, debug){ 
    super("ButtonSwitch", keysPaths, host, debug) 
  } 
 
  click(){ 
    this.send("buttonSwitch-click") 
  } 
 
  onClick(callback){ 
    this.on("buttonSwitch-click", callback) 
  } 
 
} 
