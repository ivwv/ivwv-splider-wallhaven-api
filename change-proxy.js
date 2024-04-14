const axios = require("axios");

// 获取数据来源的接口
const getSourceData = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:9097/providers/proxies", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "proxy-connection": "keep-alive",
        "sec-gpc": "1",
        Referer: "http://127.0.0.1:9097/ui/dashboard/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
    return response.data.providers["🚀 节点选择"].proxies;
  } catch (error) {
    console.error("Error fetching source data:", error);
    throw error;
  }
};

// 发送PUT请求的接口
const sendPutRequest = async (name) => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:9097/proxies/🚀 节点选择`,
      { name },
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "proxy-connection": "keep-alive",
          "sec-gpc": "1",
          Referer: "http://127.0.0.1:9097/ui/dashboard/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    );
    console.log("PUT request successful:", response.data);
  } catch (error) {
    console.error("Error sending PUT request:", error);
    throw error;
  }
};

// 定时执行任务
const interval = 3000; // 10秒
const executeTask = async () => {
  try {
    const proxies = await getSourceData();
    const randomIndex = Math.floor(Math.random() * proxies.length);
    const randomName = proxies[randomIndex].name;
    await sendPutRequest(randomName);
    console.log("PUT request sent with name:", randomName);
  } catch (error) {
    console.error("Error executing task:", error);
  }
};

// 每隔一定时间执行任务
setInterval(executeTask, interval);
