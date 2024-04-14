(async () => {
  const axios = require("axios");

  require("dotenv").config();
  // 主线程
  const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
  const numThreads = require("os").cpus().length;
  function calculateThreadRanges(threadNum, allPageNums) {
    const ranges = [];
    const pagesPerThread = Math.ceil(allPageNums / threadNum);

    for (let i = 0; i < threadNum; i++) {
      const startPage = i * pagesPerThread + 1;
      let endPage = (i + 1) * pagesPerThread;
      if (endPage > allPageNums) {
        endPage = allPageNums;
      }
      ranges.push([startPage, endPage]);
    }

    return ranges;
  }
  // 获取全部的页数

  const url = `https://p.ivwv.site/wallhaven.cc/api/v1/search?apikey=${process.env.API_KEY}&purity=111&page=1`;
  const response = await axios.get(url).catch((err) => console.log(err));
  const { data, meta } = response.data;
  // 示例用法
  // const threadRanges = calculateThreadRanges(numThreads, 30);
  const threadRanges = calculateThreadRanges(numThreads, meta.last_page);
  console.log(threadRanges);

  if (isMainThread) {
    for (let i = 0; i < threadRanges.length; i++) {
      const worker = new Worker("./worker_threads.js", {
        workerData: { index: i },
      });

      worker.on("message", (result) => {
        console.log(result);
      });

      worker.postMessage({
        start: threadRanges[i][0],
        end: threadRanges[i][1],
      }); // 计算斐波那契数列的第40项
    }
  }
})();
