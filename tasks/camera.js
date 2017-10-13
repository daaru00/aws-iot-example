const config = require('../lib/config.js');
const path = require('path');

const NodeWebcam = require( "node-webcam" );
const webcam = NodeWebcam.create({
  width: 800,
  height: 600,
  quality: 50,

  saveShots: false,
  output: "jpeg",
  device: false,
  callbackReturn: "location",

  verbose: false
});

const S3 = require('s3');
const s3 = S3.createClient({
  maxAsyncS3: 2,
  s3RetryCount: 3,
  s3RetryDelay: 1000,
  s3Options: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

const Camera = require("../devices/camera.js")
var camera = new Camera({
  "privateKey": config.PRIVATE_KEY,
  "clientCert": config.CLIENT_CERT,
  "caCert": config.CA_CERT,
}, config.HOST, config.DEBUG);

camera.connect(function(){

  camera.onPhoto(function(){
    camera.logger.info('shooting photo');

    webcam.capture("motion_captured_"+(new Date().toISOString()), function(err, data){
      if(err){
        dht11.logger.error(err);
      }else{
        var uploader = s3.uploadFile({
          localFile: data,
          s3Params: {
            Bucket: config.AS_S3_BUCKET,
            Key: path.basename(data),
          },
        });
        uploader.on('error', function(err) {
          camera.logger.error(err);
        });
        uploader.on('progress', function() {
          camera.logger.debug("uploading "+uploader.progressAmount+" of "+uploader.progressTotal);
        });
        uploader.on('end', function() {
          camera.logger.info("photo uploaded");
        });
      }
    });
  })

})
