const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
console.log("x:", process.env.SUPABASE_URL);
console.log("z:", process.env.SUPABASE_ANON_KEY);
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = { supabase };
