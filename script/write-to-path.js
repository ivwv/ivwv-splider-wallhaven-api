/**
 * 将查询结果写入文本文件 aria2c 下载的文本格式
 */
const mysql = require("mysql");
const fs = require("fs");
const pool = require("../pool");

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

// 执行查询并写入文本文件
connection.query(
  `
  SELECT path
  FROM wallpapers
  WHERE dimension_x > 8000 AND purity = 'nsfw' AND category = 'people'
`,
  (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return;
    }

    // 将结果写入文本文件
    const filePath = `output-${getNowTime()}.txt`;
    const paths = results.map((result) => result.path).join("\n");
    fs.writeFileSync(filePath, paths);

    console.log("Query results written to file: " + filePath);

    // 关闭MySQL连接
    connection.end();
  }
);

// 获取当前时间 yy-mm-dd-hh-mm-ss
const getNowTime = () => {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
};
