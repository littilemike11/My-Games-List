// "use client";

// import { useEffect } from "react";
// import { useAuth } from "@/app/auth/auth-context";
// import { useRouter } from "next/navigation";
// import { redirect } from "next/navigation";
// // import { getUserProfile } from "@/app/auth/server";

// export default function Home() {
//   const { profile, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !profile) {
//       router.replace("/popular"); // redirect for unsigned users
//     }
//   }, [loading, profile, router]);

//   if (loading || !profile) {
//     return <div>Loading...</div>; // prevent flicker
//   }

//   return (
//     <div>
//       <h1>Your Feed</h1>
//       {/* feed content */}
//     </div>
//   );
// }
// app/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "./utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/popular"); // not signed in
  }

  redirect("/feed"); // signed in
}
