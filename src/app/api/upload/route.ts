import { NextRequest } from "next/server";
import path from "path";
import { mkdir } from "fs/promises";
import { createWriteStream } from "fs";
import Busboy from "busboy";
import { queue } from "@/lib/queue";
import { addLogProcessingJob } from "@/lib/addJob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });

  return new Promise(async (resolve, reject) => {
    const busboy = Busboy({ headers: Object.fromEntries(req.headers) });
    let filePath = "";

    busboy.on("file", (_fieldname, file, {filename}) => {
      console.log(`Uploading file: ${filename}`);
      console.log(filename)
      
      const savePath = path.join(uploadDir, `${Date.now()}_${filename}`);
      filePath = savePath;
      const stream = createWriteStream(savePath);


      file.pipe(stream);

      stream.on("close", async () => {
        console.log( `File saved to: ${filePath}`);
        (await  addLogProcessingJob(filePath))
        resolve(
          new Response(
            JSON.stringify({ message: "File uploaded and job queued." }),
            { status: 200 }
          )
        );
      });

      stream.on("error", (err) => {
        reject(
          new Response(JSON.stringify({ error: "Failed to write file." }), {
            status: 500,
          })
        );
      });
    });

    busboy.on("error", (err) => {
      reject(
        new Response(JSON.stringify({ error: "Busboy error", details: err }), {
          status: 500,
        })
      );
    });

    const reader = req.body!.getReader();

    async function readChunk() {
      const { done, value } = await reader.read();
      if (done) {
        busboy.end();
        return;
      }

      busboy.write(value);
      await readChunk();
    }

    await readChunk();
  });
}
