// 工作线程
require("dotenv").config();
const { parentPort } = require("worker_threads");

const { HttpProxyAgent } = require("http-proxy-agent");
let httpsAgent = null;
if (process.env.HTTP_PROXY != null || process.env.HTTP_PROXY != undefined) {
  httpsAgent = new HttpProxyAgent(process.env.HTTP_PROXY);
}
const axios = require("axios");
const { connection } = require("./pool");
const fs = require("fs");
const { updateDomains } = require("./utils/domains");
const { getAllUserAgent } = require("./utils/user-agent");
const { getTime } = require("./utils/getTime");
let domains = [];
let UserAgent = [];
const randomDomain = () => {
  return domains[Math.floor(Math.random() * domains.length)];
};
const randomUserAgent = () => {
  return UserAgent[Math.floor(Math.random() * UserAgent.length)];
};
const interval = 1 * 60 * 1000; // 1分钟
const logToFile = (logMessage) => {
  fs.appendFileSync("./fetch_log.txt", `${getTime()} ${logMessage}`);
};
// 初始更新
async function fetchDataAndSaveToDB(page, end) {
  try {
    const random = randomDomain();
    const url = `https://${random}/api/v1/search?apikey=${process.env.API_KEY}&purity=111&page=${page}`;
    const response = await axios.get(url, {
      // 添加代理
      headers: {
        "User-Agent": randomUserAgent(),
      },
      httpsAgent,
      proxy: process.env.HTTP_PROXY ? true : false,
    });
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
    if (page < end) {
      await fetchDataAndSaveToDB(page + 1, end);
    } else if (page === end) {
      console.log("Reached the end page. Exiting the program.");
      process.exit(0); // 退出程序，参数 0 表示正常退出
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // 如果是429错误，则等待一段时间后再次尝试
      console.log("Too Many Requests, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await fetchDataAndSaveToDB(page, end);
    } else {
      // 判断error是否 为400响应码
      if (error.message == "Request failed with status code 400") {
        console.log(`Crawling completed, exit the program,The final valid page is: ${page}`);
        process.exit(0);
      }
      // 写入错误日志文件
      logToFile(`Error fetching data for page ${page}: ${error.message}\n`);
      console.error("Error fetching data: " + error.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await fetchDataAndSaveToDB(page, end);
    }
  }
}

parentPort.on("message", async (message) => {
  const { start, end } = message;
  domains = await updateDomains();
  // 加载用户代理
  UserAgent = await getAllUserAgent();
  setInterval(async () => (domains = await updateDomains()), interval);
  console.log(start, end, "start, end");
  await fetchDataAndSaveToDB(start, end);
  parentPort.postMessage(`${start}-${end}-完成`);
});
