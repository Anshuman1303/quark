const mysql = require("mysql2/promise");
const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "tiger",
  database: "quark",
  namedPlaceholders: true,
};
const pool = mysql.createPool(options);
module.exports = { pool, options };
