import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    // redirect("/popular");
    console.log(data);
  }

  return <>{children}</>;
}
