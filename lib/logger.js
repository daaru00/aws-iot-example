const winston = require('winston');

module.exports = function(config){
  var logger = new (winston.Logger)();

  logger.add(winston.transports.Console, config);

  return logger;
}
