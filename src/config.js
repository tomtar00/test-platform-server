const Pool = require('pg').Pool
require("dotenv").config();

const isRunningByJest = (process.env.JEST_WORKER_ID !== undefined)
let config, pgConfig
if (isRunningByJest) {
    // testing

    config = {
        port: process.env.PORT_DEV
    }
    pgConfig = new Pool({
        user: process.env.DB_USER_DEV,
        host: process.env.DB_HOST_DEV,
        database: process.env.DB_BASE_DEV,
        password: process.env.DB_PASS_DEV,
        port: process.env.DB_PORT_DEV,
    })
}
else {
    // production

    config = {
        port: process.env.PORT
    }
    pgConfig = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_BASE,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    })
}

exports.config = config
exports.pgConfig = pgConfig