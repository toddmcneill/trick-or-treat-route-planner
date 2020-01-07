const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  SERVER_PORT: process.env.SERVER_PORT
}
