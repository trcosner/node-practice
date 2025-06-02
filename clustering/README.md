# Node.js Express Clustering Example

This project demonstrates how to use Node.js clustering to take advantage of multi-core CPUs for handling concurrent HTTP requests in an Express application.

Each worker in the cluster runs an independent instance of the Express server, and the operating system distributes incoming requests across these workers. The application also includes a simulated CPU-intensive task to help visualize how clustering enables parallel processing.

---

## What It Is

- A basic Express.js server that uses Node's built-in `cluster` and `os` modules
- Spawns one worker process per CPU core
- Each request performs a CPU-bound computation to simulate a heavy workload
- The server responds with which worker handled the request and how long it took

---

## Why

Node.js runs on a single thread by default, which means CPU-heavy operations can block the entire event loop and delay other incoming requests.

Clustering allows you to:

- Utilize all available CPU cores
- Handle more concurrent requests efficiently
- Prevent the main thread from becoming a bottleneck

This example helps visualize how load is distributed across multiple processes and how clustering improves performance for compute-bound workloads.

---

## How It Works

1. The primary process spawns a number of worker processes equal to the number of CPU cores.
2. Each worker starts its own Express server on the same port.
3. When a request is received, the OS and Node’s cluster module distribute the connection to one of the workers.
4. Each worker runs a fake heavy computation (looping over many iterations).
5. The result, the time taken, and the process ID are returned to the user.

---

## How to Install

1. Clone the repository or copy the project folder
2. Navigate to the project directory in your terminal
3. Ensure Node.js (v12 or higher) is installed
4. Run `npm install` if you’ve added any dependencies (not required for the basic example)

---

## How to Run

1. In the terminal, run: `node index.js`
2. The server will start and spawn a worker for each CPU core
3. Visit `http://localhost:3000` in your browser
4. You will see a response showing which worker handled your request and how long it took

---

## How to Test

You can simulate concurrent load using a terminal or a load testing tool:

- Open multiple browser tabs pointing to `http://localhost:3000`
- Or use the terminal to make multiple simultaneous requests:
  - `for i in {1..10}; do curl http://localhost:3000/ & done`

You should observe:

- Requests being handled by different worker processes (based on process IDs)
- Response times reflecting the CPU work being done
- Improved concurrency compared to a single-threaded server

---

## Notes

- This example uses a simulated CPU task, but in real applications this could be image processing, encryption, or large data transformations.
- You can customize the number of workers or the type of workload to further explore clustering.
- Clustering does not share memory between workers. Use IPC or external storage if state needs to be shared.

---

## License

MIT – Use it freely and modify as needed.
