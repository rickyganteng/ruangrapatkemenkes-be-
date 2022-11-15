const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const routerNavigation = require('./routes')
require('dotenv').config()

const app = express()
const port = 3002

app.use(morgan('dev'))
app.use(cors())
app.options('*', cors())
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(express.json())
app.use('/backend1/api/v1', routerNavigation)
app.use('/backend1/api', express.static('src/uploads'))

app.listen(port, () => {
  console.log(`Express app now listen on ${port}`)
})
