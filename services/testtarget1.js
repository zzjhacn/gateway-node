const emitter = require('../utils/eventbus')
const logger = require('../log4js/log4js')()

const NAME = 'testtarget1'
emitter.on(NAME, (headers, body) => {
  logger.debug(`event[${NAME}] triggered`)
  let eid = 'response-' + headers.r_id
  setTimeout(() => {
    let num = emitter.listenerCount(eid)
    logger.debug(`event[${eid}] emitting, [${num}] listeners listening`)
    emitter.emit(eid, body)
  }, 300)
})

logger.info(`listener for event[${NAME}] started `)
