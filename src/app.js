const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const { routes } = require('./routes/routes')
const { config } = require('./config')

const resetTestDb = require('../jest.setup')

// initialize router and server instances
const router = express.Router()
const app = express()

// add middleware
app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ['page-count', 'access_token']
}))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2048kb' }));

// apply routes
routes(router)
app.use(router)

// reset testing database
resetTestDb()

// listen on port
app.listen(config.port, () => {
    console.info(`Server is running at ${config.port}`)
})
