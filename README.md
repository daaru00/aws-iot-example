## AWS Iot Sensors Example

Example of usage of AwS Iot to monitoring a temperature, humidity and motion sensors storing it's data using CloudWatch Metric.

### Getting Start

#### Create Things

Log in to AWS console and simply create 3 things like this:

Temperature
* Name: `Temperature`
* Shadow:
```json
{
  "desired": {
    "celsius": 0,
    "fahrenheit": 0,
    "kelvin": 0
  }
}
```

Humidity
* Name: `Humidity`
* Shadow:
```json
{
  "desired": {
    "percentage": 0
  }
}
```

Motion
* Name: `Motion`
* Shadow:
```json
{
  "desired": {
    "active": 0
  }
}
```
![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-things.png)

For semplicity create all the things without creating a new certificate for each, then create a single certifiate and attach it to all things.

![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-certificates.png)

#### Create Rules

For each sensor create a rule that take as input the sensor's value from the update/accepted topic and transform it into a CloudWatch metric.
In actions section add an "Sends message data to CloudWatch" action, set the values as follow.
![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-rules.png)

Temperature
* Rule query statement: `SELECT state.desired.celsius FROM '$aws/things/Temperature/shadow/update/accepted'`
* Metric name: `Temperature`
* Metric namespace: `Sensor`
* Unit `None`
* Value `${state.desired.celsius}`

Humidity
* Rule query statement: `SELECT state.desired.percentage FROM '$aws/things/Humidity/shadow/update/accepted'`
* Metric name: `Humidity`
* Metric namespace: `Sensor`
* Unit `Percent`
* Value `${state.desired.percentage}`

Motion
* Rule query statement: `SELECT state.desired.active FROM '$aws/things/Motion/shadow/update/accepted'`
* Metric name: `Motion`
* Metric namespace: `Sensor`
* Unit `None`
* Value `${state.desired.active}`

![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-rule-details.png)
attach a new IAM role name with "create" button.

#### Init Project

Clone this repo and install all npm dependencies
```bash
npm install
```
Create a `.env` file with keys paths and hostname
```
HOST=xxxxxxxxxxx.iot.us-east-1.amazonaws.com
PRIVATE_KEY=/path/to/keys/xxxxxxxxx-private.pem.key
CLIENT_CERT=/path/to/keys//xxxxxxxxx-certificate.pem.crt
CA_CERT=/path/to/keys/root-CA.crt
```

### Launch it

Exec the example using npm start script
```bash
npm start
```
Every 5 seconds the example generate a random value for each sensor and push it on AWS IoT.

### Show Metric

Go to CloudWatch and select the custom metric create "Sensor/Temperature", "Sensor/Humidity" or "Sensor/Motion"
![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-cloudwatch-metrics.png)

### Code Specs

Inside lib directory you will find a `thing.js` file that describe Thing class, core of the example.
In devices directory there are the device's file with the custom class that extends Thing class with setters method.
When the specific property is update it trigger AWS IoT SDK to push the new data
```javascript
temp.celsius = 25;
```

### Debug

To enable client side debug set to `true` the debug variable in `.env` file
```
DEBUG=true
```
To enable debug on AWS side enable logging in `Settings` -> `CloudWatch Logs` to create a stream with the selected level on debugging.
![things](https://raw.githubusercontent.com/daaru00/aws-iot-example/master/doc/aws-iot-logging.png)
