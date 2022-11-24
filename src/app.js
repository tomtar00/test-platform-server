const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const { config } = require('./config')

// initialize router and server instances
const router = express.Router()
const app = express()

// add middleware
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2048kb' }));

// TODO:apply routes

// listen on port
app.listen(config.port, () => {
    console.info(`Server is running at ${config.port}`)
})
