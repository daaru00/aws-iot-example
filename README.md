## AWS Iot Sensors Example

Example of usage of AwS Iot to monitoring a temperature, humidity and motion sensors storing it's data using CloudWatch Metric.

### Getting Start

#### Create Things

Log in to AWS console and simply create some of things like this:

Led
* Name: `Led`
* Shadow:
```json
{
  "desired": null,
  "reported": {
    "active": 1
  }
}
```

DHT11
* Name: `DHT11`
* Shadow:
```json
{
  "desired": null,
  "reported": {
    "temperature": 0,
    "humidity": 0
  }
}
```

Camera
* Name: `Camera`

Button
* Name: `Button`

Motion
* Name: `Motion`
* Shadow:
```json
{
  "desired": null,
  "reported": {
    "enable": 1,
    "isInAlarm": 1
  }
}
```

Buzzer
* Name: `Buzzer`
* Shadow:
```json
{
  "desired": null,
  "reported": {
    "ringing": 1
  }
}
```
![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-things.png)

For semplicity create all the things without creating a new certificate for each, then create a single certifiate (using "One-click certificate creation" procedure) and attach it to all things.

![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-certificates.png)

Use `Security -> Certificates` menu to create new one and edit connected things, remember to download all the keys including [Amazon Root CA](https://docs.aws.amazon.com/iot/latest/developerguide/server-authentication.html#server-authentication-certs).

![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-certificate-create.png)

#### Create CloudWatch metrics

For DHT11 sensor that report a temperature and humidity values create a rule named "DHT11" that take as input the sensor's value from the `update/accepted` topic.

DHT11
* Rule query statement: `SELECT * FROM '$aws/things/DHT11/shadow/update/accepted'`

In actions section add two actions selecting "Sends message data to CloudWatch", set the values as follow.

Temperature
* Metric name: `Temperature`
* Metric namespace: `Sensor`
* Unit `None`
* Value `${state.reported.temperature}`

Humidity
* Metric name: `Humidity`
* Metric namespace: `Sensor`
* Unit `Percent`
* Value `${state.reported.humidity}`

![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-rule-cloudwatch.png)

attach a new IAM role name with "create" button.

#### Create SNS Topic

If you want to get notfied when motion alarm is fired you have to create a second rule connected on custom topic `motion-acivated`.

Motion
* Rule query statement: `SELECT * FROM 'motion-acivated'`

Then add an action selecting "Send a message as an SNS push notification", create a new SNS topic or attach an existing one, select a raw message format and attach an IAM role.

![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-rule-sns.png)

If you want to receive an email when a message is pushed on that SNS topic, go to SNS service dashboard, select the create topic and then `Action -> Subscribe to topic`. Select email protocol,  insert into enpoint field your email and click on "Create Subscription" button.
Now an email will be sent on your email, you have to confirm that subscription simply clicking on the "Confim subscription" link.

#### Init Project

Clone this repo and install all npm dependencies
```bash
npm install
```
Create a `.env` file with keys paths (download when you created the certificate) and hostname
```
HOST=xxxxxxxxxxx.iot.us-east-1.amazonaws.com
PRIVATE_KEY=/path/to/keys/xxxxxxxxx-private.pem.key
CLIENT_CERT=/path/to/keys/xxxxxxxxx-certificate.pem.crt
CA_CERT=/path/to/keys/root-CA.crt
DEBUG=false
```

### Launch it

Exec one of the examples using npm script,

```bash
npm run dht11
```
Every second the example generate a random value for temperature and humidity value and push it on AWS IoT.

```bash
npm run motion
```
Every second the example generate a predefined state (0,0,0,1,0,0,0,1) and you'll receive the notification when the status become 1 from 0.

```bash
npm run camera
```
This example simulate a button to take a photo from the camera when clicked

```bash
npm run led
```
When remotly you change the desired state of led sensor this example notify the change.

### Show Metric

Go to CloudWatch and select the custom metric create "Sensor/Temperature" or "Sensor/Humidity"
![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-cloudwatch-metrics.png)

### Code Specs

Inside lib directory you will find a `thing.js` file that describe Thing class, core of the example.
In devices directory there are the device's file with the custom class that extends Thing class with setters method.

When the specific property is update it trigger AWS IoT SDK to push the new data
```javascript
motion.isInAlarm = 0;
```

From the inside of device's class you can push message on custom topic
```javascript
this.send("motion-acivated");
```

Get message from the topic when sended
```javascript
this.on("motion-acivated", function(message){
  // do stuff
})
```

Listen from remote state changes
```javascript
this.onChange(function(state){
  if(state.active == 0){
    //do stuff
  }else{
    //do other stuff
  }
})
```

### Debug

To enable client side debug set to `true` the debug variable in `.env` file
```
DEBUG=true
```
To enable debug on AWS side enable logging in `Settings` -> `CloudWatch Logs` to create a stream with the selected level on debugging.
![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-logging.png)

Install gpio utility on RaspberryPI
```
sudo apt install -y wiringpi
```

### PM2

Using [PM2](http://pm2.keymetrics.io/) process manager you can use the `pm2.config.js` file as configuration
```bash
pm2 start ./pm2.config.js
```

the save the current configuration
```bash
pm2 save
```

and set the process starting on system startup
```bash
pm2 startup
```

Process are now up and running
![pm2-process](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/pm2-process.png)

### RaspberryPI configuration

Electronic Schema
![schema](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/raspberrypi-schema.png)

Set GPIO port of the sensors
```
GPIO_BUTTON=27
GPIO_BUZZER=23
GPIO_DHT11=18
GPIO_LED=17
GPIO_MOTION=22
```

Install  library for DHT11 sensor
```
cd /tmp/
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.52.tar.gz
tar zxvf bcm2835-1.52.tar.gz
rm zxvf bcm2835-1.52.tar.gz
cd bcm2835-1.52
./configure
make
sudo make install
cd ..
rm -rf bcm2835-1.52
```

Install NodeJS, npm and git
```
sudo apt install nodejs nodejs-legacy npm git
```

Clone this repo from the inside of RaspberryPI
```bash
git clone https://github.com/daaru00/aws-iot-example.git
cd aws-iot-example
```

Install all npm dependencies
```bash
npm install
```

Install the additional `node-dht-sensor` module
```bash
npm install node-dht-sensor
```
