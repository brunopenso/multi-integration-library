const winston = require('winston')

const level = process.env.LOG_LEVEL || 'info'

console.log(`Starting multi-integration-library winston with ${level}. You can override this using your logger. Please see documentation for details`)

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
