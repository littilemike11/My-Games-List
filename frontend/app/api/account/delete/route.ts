import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { supabaseAdmin } from "@/app/utils/supabase/supabaseAdmin";

export async function POST() {
  console.log("delete route is reached");
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // OPTIONAL: manual cleanup
  // await supabaseAdmin.from("posts").delete().eq("user_id", user.id);

  const userId = user.id;

  // 1️⃣ Delete profiles (cascades everything else)
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id
  );

  if (deleteError) {
    console.error("Supabase deleteUser error:", deleteError);

    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
