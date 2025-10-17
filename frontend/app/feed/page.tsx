// app/feed/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();

  // This reads the session cookie from the request
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/popular"); // not signed in
  }

  return (
    <div>
      <h1>Welcome {user.email}</h1>
    </div>
  );
}
