const dotenv = require('dotenv').config()

if (dotenv.error) {
  throw dotenv.error
}

module.exports = dotenv.parsed;
