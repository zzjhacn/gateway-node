const uuid = require('uuid/v1')
const bodyParser = require('body-parser')
const logger = require('../log4js/log4js')()

let assignUUID = (req, res, next) => {
  req.headers.r_id = uuid()
  req.headers.r_timestamp = new Date().getTime()
  next()
}

let allowCrossOrigin = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST')
  next()
}

let logAfterSent = (req, res, next) => {
  res.end()
  logger.info(`Request[${req.headers.r_id}] processed completely in ${new Date().getTime() - req.headers.r_timestamp}ms`)
  next()
}

let globalErrHandler = (err, req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  res.write(JSON.stringify({
    content: 'fail',
    errmsg: err.message,
    errstack: err.stack
  }))
  res.end()
  next()
}

let flushAll = (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  res.write(JSON.stringify(res.data || {
    content: 'ok'
  }))
  next()
}

module.exports = {
  assignUUID,
  allowCrossOrigin,
  logAfterSent,
  globalErrHandler,
  flushAll
}
