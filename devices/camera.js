'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Camera extends Thing{
  constructor(keysPaths, host, debug){
    super("Camera", keysPaths, host, debug)
  }

  photo(){
    this.send("camera-shoot-photo")
  }

  onPhoto(callback){
    this.on("camera-shoot-photo", callback)
  }


}
