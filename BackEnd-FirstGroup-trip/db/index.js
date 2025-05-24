const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
	host: process.env.PG_HOST,
	port: Number(process.env.PG_PORT),
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE,
});

const db = drizzle(pool);
module.exports = db;
