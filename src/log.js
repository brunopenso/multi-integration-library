const winston = require('winston')

const level = process.env.LOG_LEVEL || 'info'

console.log(`Starting winston with ${level}`)

const logger = winston.createLogger({
  level,
  transports: [
    new winston.transports.Console({
      level
    })
  ],
  format: winston.format.combine(
    winston.format.json()
  ),
  responseWhitelist: ['metadata'],
  requestWhitelist: ['query', 'method', 'originalUrl', 'params']
})

module.exports = logger