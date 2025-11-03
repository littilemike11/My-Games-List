// app/feed/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    console.log(data);
    redirect("/popular");
  }
  return (
    <div>
      <h1>Welcome </h1>
    </div>
  );
}
