const Pool = require('pg').Pool
require("dotenv").config();

const runningJestTest = (process.env.JEST_WORKER_ID !== undefined)
const requestedTestServer = process.argv.includes('test-db')
let pgConfig

if (runningJestTest || requestedTestServer) {

    // testing

    if (requestedTestServer)
        console.log("Started testing server");
        
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

    if (requestedTestServer)
        console.log("Started production server");

    pgConfig = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_BASE,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    })
}

exports.config = {
    port: process.env.PORT
}
exports.pgConfig = pgConfig