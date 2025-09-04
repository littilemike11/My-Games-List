import { getDiscussions } from "@/app/api/supabase-api/discussion-api";
import CreateDiscussion from "@/app/components/CreateDiscussion";
import PostList from "@/app/components/PostList";
export default async function discussionsPage() {
  const discussions = await getDiscussions();
  return (
    <>
      <div className="mx-4 sm:mx-[2rem]">
        <h1 className="text-3xl mb-4">Popular Discussions</h1>
        <PostList posts={discussions} type="Discussion" />
      </div>
    </>
  );
}
