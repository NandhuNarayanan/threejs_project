import fs from "fs";
import path from "path";
import { Job } from "bullmq";
import { queue } from "./queue";

interface JobData {
  filePath: string;
}


export async function addLogProcessingJob(filePath: string): Promise<void> {
  const newSize = fs.statSync(filePath).size;

  // Get all waiting jobs
  const waitingJobs: Job<JobData>[] = await queue.getJobs(["waiting"]);
  const fileSizes: number[] = [];

  for (const job of waitingJobs) {
    try {
      const otherPath = job.data.filePath;
      const stat = fs.statSync(otherPath);
      fileSizes.push(stat.size);
    } catch (err) {
      console.warn(`⚠️ Could not access file: ${job.data.filePath}`, err);
    }
  }

  // Sort all file sizes (existing + new one)
  const allSizes = [...fileSizes, newSize].sort((a, b) => a - b);
  const priority = allSizes.indexOf(newSize) + 1; // 1 is highest

  console.log(`📦 Adding ${path.basename(filePath)} with priority ${priority}`);

  await queue.add("log-processing", { filePath }, { priority });
}
