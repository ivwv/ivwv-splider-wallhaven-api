const fs = require("fs");
// 读取 JSON 文件并将内容赋值给 domains
module.exports.updateDomains = () =>
  new Promise((resolve) => {
    fs.readFile("utils/domains.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading domains.json:", err);
        return;
      }
      try {
        domains = JSON.parse(data);
        console.log("Domains updated:", domains);
        resolve(domains);
      } catch (parseError) {
        console.error("Error parsing JSON in domains.json:", parseError);
      }
    });
  });
