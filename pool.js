require("dotenv").config();
const mysql = require("mysql");
const pool = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};
// MySQL连接配置
const connection = mysql.createConnection(pool);

// 建立MySQL连接
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});
module.exports = {connection,pool};
