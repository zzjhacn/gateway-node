const logger = require('../../log4js/log4js')()
const http = require('../../utils/httpclient')

let asyncAsync = (addr, request, cb) => {
  http.post(addr, request, (res) => {
    cb(res)
  })
}

module.exports = asyncAsync
