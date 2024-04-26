/**
 * 将查询结果写入文本文件 aria2c 下载的文本格式
 */
const mysql = require("mysql");
const fs = require("fs");
const {connection} = require("../pool");

// 执行查询并写入文本文件
connection.query(
    `
    SELECT path
    FROM wallpapers
    WHERE dimension_x > 8000 AND purity = 'sfw' AND category = 'people'
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
