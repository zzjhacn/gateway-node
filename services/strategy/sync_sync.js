const logger = require('../../log4js/log4js')()
const http = require('../../utils/httpclient')

let syncSync = (addr, request, cb) => {
  http.post(addr, request, (res) => {
    cb(res)
  })
}

module.exports = syncSync
