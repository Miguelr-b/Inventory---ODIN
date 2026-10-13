const { Pool } = require("pg");

module.exports = new Pool({
  host: "localhost", // change for production
  user: process.env.DATABASE_USER,
  database: "inventory",
  password: process.env.DATABASE_PASSWORD,
  port: 5432 
});