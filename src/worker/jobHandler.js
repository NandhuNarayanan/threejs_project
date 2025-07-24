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
  // const supabase = createClient(supabaseUrl, supabaseKey);
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  jsonStream.on("data", async ({ value }) => {
    try {
      let insertValue = await supabase.from("Log_stats").insert([value]).select();
      console.log({insertValue});
    } catch (err) {
      console.error("❌ Failed to insert object:", err);
    }
  });

  jsonStream.on("end", () => {
    console.log(`✅ Finished processing ${filePath}`);
  });

  jsonStream.on("error", (err) => {
    console.error("❌ Stream error:", err);
  });
}

module.exports = { handleLogFile };
