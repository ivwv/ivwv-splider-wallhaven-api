// 获取当前时间
module.exports.getTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return time;
};
