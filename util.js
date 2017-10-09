const url = require('url')
const http = require('http')
const https = require('https')
const _ = require('lodash')
const iconv = require('iconv-lite')

function dftParser(a){
  return a
}

function json2querystring(data, parser = dftParser) {
  try {
    let ks = _.keys(data).sort()
    let str = ''
    for (k in ks) {
      if (data[ks[k]] && data[ks[k]].trim() != '') {
        str += ('&' + ks[k] + '=' + parser(data[ks[k]].trim()))
      }
    }
    str = str.substring(1)
    return str
  } catch (e) {
    return data
  }
}

function get(_url, cb) {
  proto(_url).get(_url, (res) => {
    const {statusCode} = res
    const contentType = res.headers['content-type']

    let error
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
    }
    if (error) {
      console.error(error.message)
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
        console.log(iconv.decode(Buffer.concat([Buffer.from(rawData, 'utf16le')]), 'GBK'));
        cb(rawData)
      } catch (e) {
        console.error(e)
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`)
  })
}

function post(_url, postData, cb) {
  const options = url.parse(_url)

  const req = proto(_url).request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    let rawData = ''
    var bufferHelper = new BufferHelper();
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
      bufferHelper.concat(chunk)
      rawData += chunk
    })
    res.on('end', () => {
      console.log('No more data in response.')
      console.log(iconv.decode(bufferHelper.toBuffer(), 'GBK'));
      cb(rawData)
    })
  })

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`)
    console.log(e)
  })

  // write data to request body
  req.write(JSON.stringify(postData))
  req.end()
}

// 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 例子： (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02
// 08:09:04.423 (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return fmt
}

function proto(_url) {
  let u = url.parse(_url, true)
  return u.protocol === 'https:'
    ? https
    : http
}

module.exports = {
  get,
  post,
  json2querystring
}
