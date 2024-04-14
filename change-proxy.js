const axios = require("axios");
const clash_api = "http://127.0.0.1:9097";
const proxie = "🚀 节点选择";

// 定时切换节点时间
const interval = 3000; // 10秒

// 获取数据来源的接口
const getSourceData = async () => {
  try {
    const response = await axios.get(`${clash_api}/providers/proxies`);
    return response.data.providers[proxie].proxies;
  } catch (error) {
    console.error("Error fetching source data:", error);
    throw error;
  }
};

// 发送PUT请求的接口
const sendPutRequest = async (name) => {
  try {
    const response = await axios.put(`${clash_api}/proxies/${proxie}`, { name });
    console.log("PUT request successful:", response.data);
  } catch (error) {
    console.error("Error sending PUT request:", error);
    throw error;
  }
};

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
