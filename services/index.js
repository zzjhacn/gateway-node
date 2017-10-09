const util = require('util')
const fs = require('fs')
const _ = require('lodash')
const logger = require('../log4js/log4js')()
const emitter = require('../utils/eventbus')

let walk = (p) => {
  let files = fs.readdirSync(p)
  _.forEach(files, (f) => {
    let fname = p + '/' + f
    let s = fs.statSync(fname)
    if (s.isFile()) {
      if (f != 'index.js') {
        require(_.replace(fname, /^.\/services/g, '.'))
      }
    } else {
      walk(fname)
    }
  })
  logger.debug(`${p} walked`)
}

walk('./services')
logger.info('all listeners started')
let ns = emitter.eventNames()
_.forEach(ns, (n) => {
  logger.debug(`--------------------listeners for [${n}] :--------------------`)
  _.forEach(emitter.listeners(n), (l) => {
    logger.debug(l.toString())
  })
  logger.debug('--------------------------------------------------')
})

// let awalk = util.promisify(walk)
// awalk('./services').then(() => {
//   logger.info('all listeners started')
// }).catch((e) => {
//   logger.warn(e)
// })
