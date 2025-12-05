// app/profile/page.tsx
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { getPlayerByID } from "../api/supabase-api/profile-api";
import { Profile } from "../types/models";
import UpdateProfileForm from "../components/UpdateProfileForm";
export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/sign-up");
  }

  const userID = user.id;
  const email = user.email;

  // 2. Fetch profile directly on server
  const profile: Profile = await getPlayerByID(userID);

  return (
    <div className="max-w-md space-y-6">
      {/* Profile Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold capitalize">{profile?.username}</h1>
        <p className="text-sm opacity-70">{email}</p>
        <p className="text-base">{profile?.bio}</p>
      </div>

      {/* Settings / Edit Bio */}
      <UpdateProfileForm userID={profile.id} bio={profile.bio ?? ""} />
    </div>
  );
}
