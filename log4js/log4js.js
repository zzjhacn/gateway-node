const log4js = require('log4js')
const log4js_config = require('./log4js.cfg.json')
log4js.configure(log4js_config)

let loggers = {
  default: log4js.getLogger()
}

let logger = function(category = 'default') {
  if (!loggers[category]) {
    loggers[category] = log4js.getLogger(category)
  }
  return loggers[category]
}

module.exports = logger
