import { createClient } from "@supabase/supabase-js";
//! non-null assertion operator
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
