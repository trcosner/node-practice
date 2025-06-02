const cluster = require("cluster");
const os = require("os");
const express = require("express");

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const app = express();

  // Simulate a heavy CPU task
  function heavyComputation() {
    let count = 0;
    for (let i = 0; i < 1e8; i++) {
      count += i;
    }
    return count;
  }

  app.get("/", (req, res) => {
    const start = Date.now();
    const result = heavyComputation();
    const duration = Date.now() - start;

    res.send(
      `Handled by worker ${process.pid}. Computation result: ${result}. Took ${duration}ms.`,
    );
  });

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is listening on port ${PORT}`);
  });
}
