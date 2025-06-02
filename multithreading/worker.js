const { workerData, parentPort } = require("worker_threads");

const { thread_id, thread_count, total_iterations } = workerData;

const chunk_size = Math.floor(total_iterations / thread_count);
const start = thread_id * chunk_size;
const end =
  thread_id === thread_count - 1
    ? total_iterations // last thread gets any remainder
    : start + chunk_size;

let counter = 0;
for (let i = start; i < end; i++) {
  counter++;
}

parentPort.postMessage(counter);
