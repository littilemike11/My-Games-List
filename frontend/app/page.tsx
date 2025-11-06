// app/feed/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();

  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user?.claims) {
    redirect("/popular");
  }
  return (
    <div>
      <h1>Welcome {user.claims.user_metadata.username}</h1>
    </div>
  );
}
