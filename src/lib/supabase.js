const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = process.env.SUPABASE_URL;
const supabaseUrl = "https://vsfwqyoseqddumdvhwot.supabase.co";
// const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzZndxeW9zZXFkZHVtZHZod290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDMyODEsImV4cCI6MjA2ODQxOTI4MX0.jXteZ-QPEbj3B1hVgwMNbCYaYQdP1m_mav-LWcfH4Ig";
console.log("x:", process.env.SUPABASE_URL);
console.log("z:", process.env.SUPABASE_ANON_KEY);
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = { supabase };
