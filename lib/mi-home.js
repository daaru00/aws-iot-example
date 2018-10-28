const miio = require('miio');

class MiHome {

    constructor() {
        this.devices = {};
    }

    load(config, callbacks) {
        this.config = config || {};
        console.info('Looking for gateway..')

        const devices = miio.devices({
            cacheTime: 300
        });

        const gatewaySettings = this.config.gateway;
        devices.on('available', async (deviceDiscovered) => {
            if (deviceDiscovered.id == gatewaySettings.id) {
                console.info('Gateway found!')
                let device = await miio.device({ address: deviceDiscovered.address, token: gatewaySettings.token });
                console.debug('Connected to: ', device.miioModel)
                let children = device.children();
                for (let child of children) {

                    if (child.model == 'lumi.gateway.v3.light') {
                        this.devices.light = child;
                        if (typeof callbacks['light'] === 'function') callbacks['light']();
                        continue;
                    }

                    console.debug('Child found: ' + child.miioModel);
                    switch (child.miioModel) {
                        case 'lumi.plug':
                            if (typeof callbacks['plug'] === 'function') callbacks['plug']();
                            this.devices.plug = child;
                            break;
                        case 'lumi.magnet':
                            if (typeof callbacks['door'] === 'function') callbacks['door']();
                            this.devices.door = child;
                            break;
                        case 'lumi.switch':
                            if (typeof callbacks['switch'] === 'function') callbacks['switch']();
                            this.devices.switch = child;
                            break;
                        case 'lumi.sensor_ht':
                            if (typeof callbacks['sensor'] === 'function') callbacks['sensor']();
                            this.devices.sensor = child;
                            break;
                        case 'lumi.motion':
                            if (typeof callbacks['motion'] === 'function') callbacks['motion']();
                            this.devices.motion = child;
                            break;
                        default:
                            console.debug('Connected child not recognized:', child.metadata.types);
                    }

                }
            }
        });

        devices.on('unavailable', device => {
            console.error('device disconnected:', device)
        });
    }

    async getTemperature(defaultValue) {
        if (this.devices.sensor) {
            let response = await this.devices.sensor.temperature();
            console.log('response from sensor temperature', response);
            return response !== null ? response.value : defaultValue;
        }else{
            return null;
        }
    }

    async getHumidity(defaultValue) {
        if (this.devices.sensor) {
            let response = await this.devices.sensor.relativeHumidity();
            console.log('response from sensor humidity', response);
            return response !== null ? response : defaultValue;
        }else{
            return null;
        }
    }

}

module.exports = new MiHome();
