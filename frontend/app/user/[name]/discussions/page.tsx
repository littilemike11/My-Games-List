import { getDiscussionsByUser } from "@/app/api/supabase-api/discussion-api";
import { Discussion } from "@/app/types/models";
import { getPlayerByName } from "@/app/api/supabase-api/profile-api";
import DiscussionItem from "@/app/components/DiscussionItem";
interface DiscussionsPageProps {
  params: Promise<{ name: string }>;
}

export default async function DiscussionsPage({
  params,
}: DiscussionsPageProps) {
  const { name } = await params;
  const username = name; // 👈 comes from /user/[name]/Discussions
  const userID = await getPlayerByName(username);
  // if you want to fetch by userId instead of username, you’ll need a lookup here
  const discussions: Discussion[] = await getDiscussionsByUser(userID.id);
  return (
    <div className="mx-4 sm:mx-[2rem]">
      <h2 className="text-2xl mb-6 pb-2 border-b capitalize">
        {username}'s Discussions ({discussions.length}){" "}
      </h2>
      {discussions.length > 0 ? (
        <div className="flex flex-col gap-4">
          {discussions.map((discussion) => (
            <DiscussionItem key={discussion.id} discussion={discussion} />
          ))}
        </div>
      ) : (
        <p>{username} has not posted any discussions yet</p>
      )}
    </div>
  );
}
