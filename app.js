const pool = require("./pool");
const axios = require("axios");
const mysql = require("mysql");
const fs = require("fs");
console.log(pool);
console.log(process.env);
require("dotenv").config();
// 防止 update 时 github actions 会运行，使用环境变量控制
if (!process.env.IS_SPLIDER) return console.log("本次不会执行");
const startNum = parseInt(process.env.START || 1);
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

// wallhaven.ivwv.site wallhaven.cc p.ivwv.site/wallhaven.cc 随机返回这三个
const randomDomain = () => {
  const domains = [
    "wallhaven.cc", // 可以自行添加代理网址
  ];
  return domains[Math.floor(Math.random() * domains.length)];
};

const logToFile = (logMessage) => {
  console.log(logMessage);
  fs.appendFileSync("./fetch_log.txt", logMessage);
};

// 请求Wallhaven数据并保存到MySQL
async function fetchDataAndSaveToDB(page) {
  try {
    const random = randomDomain();
    const url = `https://${random}/api/v1/search?apikey=${process.env.API_KEY}&purity=111&page=${page}`;
    // console.log(url);
    const response = await axios.get(url);

    const { data, meta } = response.data;

    // 保存数据到MySQL
    for (const item of data) {
      item.colors = item.colors.join(",");
      item.thumbs = JSON.stringify(item.thumbs);
      connection.query("INSERT INTO wallpapers SET ?", item, (err, result) => {
        if (err) throw err;
      });
    }

    // 写入日志文件
    logToFile(`Page ${page} data saved to MySQL.-- use ${random}\n`);

    // 如果不是最后一页，则递归调用自身
    const endPage = process.env.END ? parseInt(process.env.END) : meta.last_page;

    if (page < endPage) {
      await fetchDataAndSaveToDB(page + 1);
    } else if (page === endPage) {
      console.log("Reached the end page. Exiting the program.");
      process.exit(0); // 退出程序，参数 0 表示正常退出
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // 如果是429错误，则等待一段时间后再次尝试
      console.log("Too Many Requests, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await fetchDataAndSaveToDB(page);
    } else {
      // 写入错误日志文件
      logToFile(`Error fetching data for page ${page}: ${error.message}\n`);
      console.error("Error fetching data: " + error.message);

      await new Promise((resolve) => setTimeout(resolve, 5000));
      await fetchDataAndSaveToDB(page);
    }
  }
}

// 开始从第一页请求数据
fetchDataAndSaveToDB(startNum);
