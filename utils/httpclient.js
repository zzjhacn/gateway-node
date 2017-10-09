const url = require('url')
const http = require('http')
const https = require('https')
const _ = require('lodash')
const logger = require('../log4js/log4js')()

let proto = (_url) => {
  let u = url.parse(_url, true)
  return u.protocol === 'https:' ? https : http
}

let dftParser = (a) => {
  return a
}

let get = (_url, cb) => {
  proto(_url).get(_url, (res) => {
    const { statusCode } = res
    const contentType = res.headers['content-type']

    let error
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
    }
    if (error) {
      logger.error(error.message)
      // consume response data to free up memory
      res.resume();
      return
    }

    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => {
      rawData += chunk
    })
    res.on('end', () => {
      try {
        // logger.info(iconv.decode(Buffer.concat([Buffer.from(rawData, 'utf16le')]), 'GBK'));
        cb(rawData)
      } catch (e) {
        logger.error(e)
      }
    });
  }).on('error', (e) => {
    logger.error(`Got error: ${e.message}`)
  })
}

function post(_url, postData, cb) {
  const options = url.parse(_url)

  const req = proto(_url).request(options, (res) => {
    res.setEncoding('utf8')
    let rawData = ''
    // var bufferHelper = new BufferHelper();
    res.on('data', (chunk) => {
      // bufferHelper.concat(chunk)
      rawData += chunk
    })
    res.on('end', () => {
      // console.log(iconv.decode(bufferHelper.toBuffer(), 'GBK'));
      cb(rawData)
    })
  })

  req.on('error', (e) => {
    logger.error(`problem with request: ${e.message}`)
    logger.error(e)
  })

  req.write(JSON.stringify(postData))
  req.end()
}

module.exports = {
  get,
  post
}
