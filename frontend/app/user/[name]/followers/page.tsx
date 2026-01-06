import {
  getPlayerIdByName,
  getFollowers,
} from "@/app/api/supabase-api/profile-api";
import { ProfileItem } from "@/app/components/ProfileItem";
import { ProfilePreview, Profile } from "@/app/types/models";
interface followersPageProps {
  params: Promise<{ name: string }>;
}

export default async function followersPage({ params }: followersPageProps) {
  const { name } = await params;
  const username = name; // 👈 comes from /user/[name]/followers
  const player = await getPlayerIdByName(username);
  const followers: Profile[] = await getFollowers(player?.id);
  console.log("custom list", followers);

  return (
    <>
      <div className="mx-4 sm:mx-[2rem]">
        <h2 className="text-2xl mb-6 pb-2 border-b capitalize">
          {username}'s Followers ({followers.length})
        </h2>
        <div>
          {followers.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
              {followers.map((profile, index) => (
                <ProfileItem key={index} profile={profile} />
              ))}
            </div>
          ) : (
            <p>{username} has not followed anyone yet</p>
          )}
        </div>
      </div>
      {/* featured, popular this week, recently liked, crew picks */}
    </>
  );
}
