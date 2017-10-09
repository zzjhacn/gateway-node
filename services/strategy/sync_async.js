const logger = require('../../log4js/log4js')()
const http = require('../../utils/httpclient')

let syncAsync = (addr, request) => {
  http.post(addr, request)
}

module.exports = syncAsync
