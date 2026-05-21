import { createClient } from "@supabase/supabase-js";

// First Supabase project (Account 1)
const supabaseUrl1 = "https://cvherctwrqdsaxgjftay.supabase.co";
const supabaseKey1 =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aGVyY3R3cnFkc2F4Z2pmdGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MjM4MjIsImV4cCI6MjA0NDQ5OTgyMn0.bYEjOHwp_052jsxvl78lbXL6IpYhaBaXqQtOPiaGv6c";
const supabase1 = createClient(supabaseUrl1, supabaseKey1);

// Second Supabase project (Account 2)
const supabaseUrl2 = "https://fpbqioozeeomrxafmbun.supabase.co";
const supabaseKey2 =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwYnFpb296ZWVvbXJ4YWZtYnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwOTk0OTUsImV4cCI6MjA5NDY3NTQ5NX0.ScXwE_vhGYFIvlJd2kBODiW5MK7Mxx183FPhWgejhq0";

const supabase2 = createClient(supabaseUrl2, supabaseKey2);

// Export them individually or as an object
export { supabase1, supabase2 };
