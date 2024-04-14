const fs = require("fs");
// 读取 JSON 文件并将内容赋值给 domains
module.exports.getAllUserAgent = () =>
  new Promise((resolve) => {
    fs.readFile("utils/UserAgent.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading UserAgent.json:", err);
        return;
      }
      try {
        UserAgent = JSON.parse(data);
        // console.log("UserAgent updated:", UserAgent);
        resolve(UserAgent);
      } catch (parseError) {
        console.error("Error parsing JSON in UserAgent.json:", parseError);
      }
    });
  });
