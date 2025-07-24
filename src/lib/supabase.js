const { createClient }= require("@supabase/supabase-js") ;

const supabaseUrl = "https://vsfwqyoseqddumdvhwot.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzZndxeW9zZXFkZHVtZHZod290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDMyODEsImV4cCI6MjA2ODQxOTI4MX0.jXteZ-QPEbj3B1hVgwMNbCYaYQdP1m_mav-LWcfH4Ig";
console.log({ supabaseUrl, supabaseKey });
 const supabase = createClient(supabaseUrl, supabaseKey);
 module.exports = { supabase };
