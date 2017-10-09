const app = require('express')()
const router = require('./router/router')
const logger = require('./log4js/log4js')()
const bodyParser = require('body-parser')

const PORT = 3000

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.json({ type: 'text/plain' }))
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', extended: false }))
app.use(bodyParser.json({ type: 'application/x-www-form-urlencoded' }))
app.use(bodyParser.json({ type: 'text/html' }))

app.use(router)


app.listen(PORT, () => {
  require('./services/')
  logger.info(`Server started. Listening on port ${PORT}.`)
})
