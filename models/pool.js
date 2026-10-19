const { Pool } = require("pg");

module.exports = new Pool({
  host: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: 5432 
});