const { Pool } = require("pg");

const url = process.env.DATABASE_URL;
console.log("DATABASE_URL:", url ? url.replace(/:\/\/.*@/, "://***@") : "MISSING");

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
});