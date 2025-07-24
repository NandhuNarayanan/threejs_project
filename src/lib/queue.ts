import { Queue } from "bullmq";
import { redis } from "./redis";

export const queue = new Queue("log-processing", {
  connection: redis,
});

queue
  .waitUntilReady()
  .then(async() => {
    console.log("✅ BullMQ queue connected to Redis");
    // await queue.add("log-processing", { filePath: "initial" })
  })
  .catch((err) => {
    console.error("❌ Failed to connect to Redis:", err);
  });

