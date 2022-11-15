const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const routerNavigation = require('./routes')
require('dotenv').config()
const path = require('path')

const app = express()
const port = 3002

app.use(
  morgan('dev', {
    skip: function (req, res) {
      return res.statusCode < 405
    }
  })
)
app.use(cors())
app.options('*', cors())
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(express.json())
app.use('/backend1/api/v1', routerNavigation)
// app.use('/backend1/api', express.static('src/uploads'))
app.use('/backend1/api', express.static(path.join(__dirname, '/uploads')))

app.listen(port, () => {
  console.log(`Express app now listen on ${port}`)
})
