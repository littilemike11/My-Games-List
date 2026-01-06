import {
  getPlayerIdByName,
  getFollowing,
} from "@/app/api/supabase-api/profile-api";
import { ProfileItem } from "@/app/components/ProfileItem";
import { ProfilePreview, Profile } from "@/app/types/models";
interface FollowingPageProps {
  params: Promise<{ name: string }>;
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { name } = await params;
  const username = name; // 👈 comes from /user/[name]/Following
  const player = await getPlayerIdByName(username);
  const following: Profile[] = await getFollowing(player?.id);
  console.log("custom list", following);

  return (
    <>
      <div className="mx-4 sm:mx-[2rem]">
        <h2 className="text-2xl mb-6 pb-2 border-b capitalize">
          {username}'s Following ({following.length})
        </h2>
        <div>
          {following.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
              {following.map((profile, index) => (
                <ProfileItem key={index} profile={profile} />
              ))}
            </div>
          ) : (
            <p>{username} has no Following yet</p>
          )}
        </div>
      </div>
      {/* featured, popular this week, recently liked, crew picks */}
    </>
  );
}
