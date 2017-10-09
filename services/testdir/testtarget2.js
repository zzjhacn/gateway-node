const emitter = require('../../utils/eventbus')
const logger = require('../../log4js/log4js')()

const NAME = 'testtarget2'
emitter.on(NAME, (headers, body) => {
  logger.debug(`event[${NAME}] triggered`)
  let eid = 'response-' + headers.r_id
  setTimeout(() => {
    emitter.emit(eid, body)
    let num = emitter.listenerCount(eid)
    logger.debug(`event[${eid}] emited, [${num}] listeners listening`)
  }, 30)
})

logger.info(`listener for event[${NAME}] started `)
