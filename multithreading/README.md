# Node.js Multithreading Practice

This project demonstrates how to use worker threads in Node.js to perform CPU-intensive tasks without blocking the main thread. It includes two endpoints: one that performs blocking computation on the main thread, and another that distributes the work across multiple threads using the built-in `worker_threads` module.

---

## What It Is

This is a simple Express application that showcases:

- A `/blocking` endpoint which performs a long-running computation directly on the main thread and blocks the server.
- A `/non-blocking` endpoint which splits the same workload across multiple worker threads, keeping the server responsive.

It helps illustrate the difference between synchronous CPU-bound work and true parallel execution using threads in Node.js.

---

## Why

Node.js is single-threaded by default. Performing expensive operations on the main thread can block all other incoming requests. This project shows how to move such work off the main thread to keep your application responsive by using worker threads.

---

## How It Works

- The `/blocking` endpoint runs a single loop with 20,000,000,000 iterations directly on the main thread.
- The `/non-blocking` endpoint splits that workload across four worker threads.
- Each worker is assigned a portion of the total work using its thread ID and the total number of threads.
- When all workers complete their assigned computation, the results are collected, summed, and returned in the response.
- This design utilizes multiple CPU cores to parallelize the work and prevent blocking the Node.js event loop.

---

## How to Install

1. Clone the repository:
   - git clone https://github.com/yourusername/node_practice.git
2. Navigate into the project directory:
   - cd node_practice
3. Install dependencies (none required beyond Node.js itself):
   - npm install

Note: No third-party libraries are required. This project only uses Node.js core modules.

---

## How to Run

1. Start the server:

   - node index.js

2. You should see output like:

   - App listening on port 3000

3. You can now test the endpoints:
   - Visit http://localhost:3000/blocking in a browser or using curl
   - Visit http://localhost:3000/non-blocking to see the multithreaded version

---

## How to Test

To test and compare blocking vs. non-blocking:

1. Send a single request to `/blocking`. It will take a long time and block all other traffic.
2. Send a single request to `/non-blocking`. It will take less time and not freeze the server.
3. Try sending two requests to `/non-blocking` concurrently. They will be processed simultaneously using four threads each.
4. Try sending a `/blocking` request while `/non-blocking` requests are running. The blocking request will freeze the server and delay responses from the worker threads until it finishes.

---

## Project Structure

- index.js: Main Express server that defines both endpoints and spawns worker threads.
- worker.js: Code that runs inside each worker thread and performs a portion of the total computation.
- README.md: This documentation.

---

## Requirements

- Node.js version 12 or higher (to support `worker_threads`)
- A machine with multiple CPU cores to benefit from threading

---

## License

This project is open-source and licensed under the MIT License.

---

Happy hacking!
