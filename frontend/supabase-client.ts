import { createClient } from "@supabase/supabase-js";
//! non-null assertion operator
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
