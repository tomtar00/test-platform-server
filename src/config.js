const Pool = require('pg').Pool
require("dotenv").config();

exports.config = {
    port: process.env.PORT
}

exports.pgConfig = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_BASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
})