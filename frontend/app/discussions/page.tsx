import { getDiscussions } from "../api/supabase-api/discussion-api";
import DiscussionItem from "../components/DiscussionItem";
export default async function discussionsPage() {
  const discussions = await getDiscussions();
  console.log(discussions);
  return (
    <>
      <h1>discussions</h1>
      <div className="grid grid-cols-2">
        {discussions.map((discussion, index) => (
          <DiscussionItem key={index} discussion={discussion} />
        ))}
      </div>
    </>
  );
}
