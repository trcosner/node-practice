const express = require("express");
const { Worker } = require("worker_threads");
const app = express();

const THREAD_COUNT = 4;

const port = process.env.PORT || 3000;

function createWorker(thread_id) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: {
        thread_count: THREAD_COUNT,
        total_iterations: 20000000000,
        thread_id,
      },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (error) => {
      reject(`An error occured ${error}`);
    });
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

app.get("/non-blocking", async (req, res) => {
  const workerPromises = [];

  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker(i));
  }
  const thread_results = await Promise.all(workerPromises);
  const count = thread_results.reduce((acc, res) => {
    return acc + res;
  }, 0);

  res.status(200).send(`This is non-blocking - count is ${count}`);
});

app.get("/blocking", async (req, res) => {
  let counter = 0;
  for (let i = 0; i < 20000000000; i++) {
    counter++;
  }
  res.status(200).send(`This is blocking - count is ${counter}`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
