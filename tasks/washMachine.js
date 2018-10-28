const config = require('../lib/config.js');

const Gpio = require('onoff').Gpio;
const motor = new Gpio(config.GPIO_MOTOR, 'out');
const ledGreen = new Gpio(config.GPIO_LED_GREEN, 'out');
const ledRed = new Gpio(config.GPIO_LED_RED, 'out');
const ledYellow = new Gpio(config.GPIO_LED_YELLOW, 'out');
const button = new Gpio(config.GPIO_BUTTON1, 'in', 'rising', {debounceTimeout: 10});

const cycles = ['lavaggio', 'sciacquare', 'centrifuga'];

const certs = {
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}
const WashMachine = require("../devices/washMachine.js")
const washMachine = new WashMachine(certs, config.HOST, config.DEBUG);

washMachine.connect(function () {

  washMachine.onGoogleHomeActionSetToggles(function (params) {
    washMachine.currentToggleSettings = params.updateToggleSettings;
  })

  washMachine.onGoogleHomeActionSetModes(function (params) {
    washMachine.currentModeSettings = params.currentModeSettings;
  })

  washMachine.onGoogleHomeActionStartStop(function (params) {
    if (params.start) {
      startCycle();
    }else{
      stopCycle();
    }
  })

  washMachine.onGoogleHomeActionPauseUnpause(function (params) {
    if (washMachine.isRunning == false) return;
    washMachine.isPaused = params.pause;
    if (params.pause) {
      pause()
    } else {
      unPause()
    }
  })

  washMachine.onGoogleHomeActionOnOff(function (params) {
    washMachine.on = params.on;
    if (params.on) {
      stopCycle();
    }
  })

  let timeoutWorker = null;
  let currentIndex = 0;
  function startCycle(index) {
    currentIndex = index;

    if (index === cycles.length) {
      washMachine.currentRunCycle = [];
      washMachine.currentTotalRemainingTime = 0;
      washMachine.currentCycleRemainingTime = 0;
      washMachine.isRunning = false;
      ledGreen.writeSync(0);
      blinkLedRed();
      return;
    }

    index = index || 0;
    washMachine.currentRunCycle = [{
      "currentCycle": cycles[index],
      "nextCycle": (index !== cycles.length - 1) ? cycles[index] : null,
      "lang": "it"
    }]
    washMachine.currentTotalRemainingTime = (index + 1)*10;
    washMachine.currentCycleRemainingTime = 10;    
    washMachine.isRunning = true;

    motor.writeSync(1);
    ledGreen.writeSync(1);
    timeoutWorker = setTimeout(function () {
      startCycle(index + 1)
    }, 10)
  }

  function stopCycle(){
    washMachine.currentRunCycle = [];
    washMachine.currentTotalRemainingTime = 0;
    washMachine.currentCycleRemainingTime = 0;
    washMachine.isRunning = false;
    ledGreen.writeSync(0);
  }

  function pause() {
    motor.writeSync(0);
    clearTimeout(timeoutWorker);
    ledYellow.writeSync(1);
  }

  function unPause() {
    motor.writeSync(1);
    ledYellow.writeSync(0);
    timeoutWorker = setTimeout(function () {
      startCycle(currentIndex + 1)
    }, 10 - washMachine.currentCycleRemainingTime)
  }

  let blinkInterval = null;

  function blinkLedRed() {
    if (ledRed.readSync() === 0) {
      ledRed.writeSync(1);
    } else {
      ledRed.writeSync(0);
    }
    if (blinkInterval === null) {
      blinkInterval = setInterval(blinkLedRed, 250);
    }
  }

  function endBlink() {
    clearInterval(blinkInterval);
    blinkInterval = null;
    ledRed.writeSync(0);
  }

  button.watch((err, value) => {
    if (err) {
      throw err;
    }

    if (blinkInterval == null) return;

    clearInterval(blinkInterval);
    ledRed.writeSync(0);
    blinkInterval = null;
  });

})
