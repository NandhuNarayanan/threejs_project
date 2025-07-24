const { Worker } = require("bullmq");
// const { redis } = require("../lib/redis");
const { handleLogFile } = require("./jobHandler");

const worker = new Worker(
  "log-processing",
  async (job) => {
    const { filePath } = job.data;
    await handleLogFile(filePath);
  },
  { connection: "redis://localhost:6379" }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});
