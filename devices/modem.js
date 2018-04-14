'use strict';

const Thing = require("../lib/thing.js")

module.exports = class Modem extends Thing{
  constructor(keysPaths, host, debug){
    super("Modem", keysPaths, host, debug)
  }

  set info(value){
    this.update({
      "upload": value.upload,
      "download": value.download,
      "publicIP": value.publicIP
    })
  }

  set isAminConnected(value){
    if(value != this.state.isAminConnected){
      if(value == 1){
        this.send("modem-admin-connected");
      }else{
        this.send("modem-admin-disconnected");
      }
      this.update({
        "isAminConnected": value
      })
    }
  }

}
