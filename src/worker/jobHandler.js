const fs = require("fs");
const { parser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const { supabase } = require("../lib/supabase");

async function handleLogFile(filePath) {
  console.log({ filePath });

  const jsonStream = fs
    .createReadStream(filePath)
    .pipe(parser())
    .pipe(streamArray());

  console.log(`Processing file: ${filePath}`);

  jsonStream.on("data", async ({ value }) => {
    try {
      let insertValue = await supabase
        .from("Log_stats")
        .insert([value])
        .select();
      // console.log({insertValue});
    } catch (err) {
      console.error("❌ Failed to insert object:", err);
    }
  });

  jsonStream.on("end", () => {
    console.log(`✅ Finished processing ${filePath}`);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`❌ Failed to delete file: ${filePath}`, err);
      } else {
        console.log(`🧹 Deleted file: ${filePath}`);
      }
    });
  });

  jsonStream.on("error", (err) => {
    console.error("❌ Stream error:", err);
  });
}

module.exports = { handleLogFile };
