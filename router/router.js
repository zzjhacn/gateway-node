const router = require('express').Router()
const bodyParser = require('body-parser')
const _ = require('lodash')

const emitter = require('../utils/eventbus');
const filters = require('./filters')
const pkger = require('../utils/pkger')
const logger = require('../log4js/log4js')()

router.use(filters.globalErrHandler)

router.use(filters.assignUUID)
// router.use(filters.allowCrossOrigin)

router.route('*')
  .get((req, res, next) => {
    req.body = req.query
    req.body.r_method = "GET"
    next()
  })
  .post((req, res, next) => {
    req.body = _.extend(req.body, req.query)
    req.body.r_method = "POST"
    next()
  })

router.use(pkger.unpkg)

router.route('/gateway')
  .all((req, res, next) => {
    let eid = 'response-' + req.headers.r_id
    emitter.once(eid, (data) => {
      logger.debug(`event[${eid}] triggered and then removed`)
      emitter.removeAllListeners(eid)
      res.data = data
      next()
    })
    logger.debug(`listener for event[${eid}] started`)

    let num = emitter.listenerCount(req.body.target)
    logger.debug(`evnet[${req.body.target}] emitting, [${num}] listeners listening`)
    emitter.emit(req.body.target, req.headers, req.body)
  })

router.use(pkger.pkg)

router.use(filters.flushAll)
router.use(filters.logAfterSent)

module.exports = router
