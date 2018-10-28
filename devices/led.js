'use strict';

const Thing = require("../lib/thing.js")

module.exports = class HUBLight extends Thing{
  constructor(keysPaths, host, debug){
    super("Led", keysPaths, host, debug)
  }

  get activeGreen(){
    return this.state.green || 0;
  }

  set activeGreen(value){
    if(value != this.state.green){
      this.update({
        "green": value
      })
    }
  }

  get activeRed(){
    return this.state.red || 0;
  }

  set activeRed(value){
    if(value != this.state.green){
      this.update({
        "red": value
      })
    }
  }

  get activeYellow(){
    return this.state.yellow || 0;
  }

  set activeYellow(value){
    if(value != this.state.green){
      this.update({
        "yellow": value
      })
    }
  }

  onSwitchOnRed(callback){
    this.onChange(function(state){
      if(state.red == 1){
        callback();
      }
    })
  }

  onSwitchOffRed(callback){
    this.onChange(function(state){
      if(state.red == 0){
        callback();
      }
    })
  }

  onSwitchOnGreen(callback){
    this.onChange(function(state){
      if(state.green == 1){
        callback();
      }
    })
  }

  onSwitchOffGreen(callback){
    this.onChange(function(state){
      if(state.green == 0){
        callback();
      }
    })
  }

  onSwitchOnYellow(callback){
    this.onChange(function(state){
      if(state.yellow == 1){
        callback();
      }
    })
  }

  onSwitchOffYellow(callback){
    this.onChange(function(state){
      if(state.yellow == 0){
        callback();
      }
    })
  }

  onGoogleHomeActionGreen(callback){
    this.on("led-green-action", callback)
  }
  onGoogleHomeActionRed(callback){
    this.on("led-red-action", callback)
  }
  onGoogleHomeActionYellow(callback){
    this.on("led-yellow-action", callback)
  }
}
