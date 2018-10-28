'use strict';

const Thing = require("../lib/thing.js")

module.exports = class HUBLight extends Thing{
  constructor(keysPaths, host, debug){
    super("Motor", keysPaths, host, debug)
  }

  get isRunning(){
    return this.state.isRunning || false;
  }

  set isRunning(value){
    if(value != this.state.isRunning){
      this.update({
        "isRunning": value
      })
    }
  }

  get isPaused(){
    return this.state.isPaused || false;
  }

  set isPaused(value){
    if(value != this.state.isPaused){
      this.update({
        "isPaused": value
      })
    }
  }

  get currentModeSettings(){
    return this.state.currentModeSettings || {};
  }

  set currentModeSettings(value){
    if(value != this.state.currentModeSettings){
      this.update({
        "currentModeSettings": value
      })
    }
  }

  get currentToggleSettings(){
    return this.state.currentToggleSettings || {};
  }

  set currentToggleSettings(value){
    if(value != this.state.currentToggleSettings){
      this.update({
        "currentToggleSettings": value
      })
    }
  }

  get currentCycle(){
    return this.state.currentCycle || {};
  }

  set currentCycle(value){
    if(value != this.state.currentCycle){
      this.update({
        "currentCycle": value
      })
    }
  }

  get nextCycle(){
    return this.state.nextCycle || {};
  }

  set nextCycle(value){
    if(value != this.state.nextCycle){
      this.update({
        "nextCycle": value
      })
    }
  }

  get currentTotalRemainingTime(){
    return this.state.currentTotalRemainingTime || 0;
  }

  set currentTotalRemainingTime(value){
    if(value != this.state.currentTotalRemainingTime){
      this.update({
        "currentTotalRemainingTime": value
      })
    }
  }

  get currentCycleRemainingTime(){
    return this.state.currentCycleRemainingTime || 0;
  }

  set currentCycleRemainingTime(value){
    if(value != this.state.currentCycleRemainingTime){
      this.update({
        "currentCycleRemainingTime": value
      })
    }
  }

  onGoogleHomeActionSetToggles(callback){
    this.on("wash-machine-set-toggles", callback)
  }
  onGoogleHomeActionSetModes(callback){
    this.on("wash-machine-set-modes", callback)
  }
  onGoogleHomeActionStartStop(callback){
    this.on("wash-machine-start-stop", callback)
  }
  onGoogleHomeActionPauseUnpause(callback){
    this.on("wash-machine-pause-unpause", callback)
  }
  onGoogleHomeActionOnOff(callback){
    this.on("wash-machine-on-off", callback)
  }
}
