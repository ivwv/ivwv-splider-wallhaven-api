const axios = require("axios");

require("dotenv").config();
const main = async () => {
  // 主线程
  const { Worker, isMainThread } = require("worker_threads");
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

  const url = `https://p.ivwv.site/wallhaven.cc/api/v1/search?apikey=${process.env.API_KEY}&purity=111&page=1`;
  const response = await axios.get(url).catch((err) => console.log(err));
  const { data, meta } = response.data;
  const threadRanges = calculateThreadRanges(
    numThreads,
    parseInt(process.env.END) || meta.last_page
  );
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
      });
    }
  }
};
(async () => {
  if (process.env.IS_SPLIDER || process.env.IS_SPLIDER == "true") {
    main();
  } else {
    return console.log("本次不会执行");
  }
})();
