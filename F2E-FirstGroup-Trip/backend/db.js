const { Pool } = require('pg')
require('dotenv').config();

const pool = new Pool ({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

module.exports = pool ;