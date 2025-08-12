import { getDiscussions } from "../api/supabase-api/discussion-api";
import CreateDiscussion from "../components/CreateDiscussion";
import PostList from "../components/PostList";
export default async function discussionsPage() {
  const discussions = await getDiscussions();
  console.log(discussions);
  return (
    <>
      <div className="mx-4 sm:mx-[2rem]">
        <h1 className="text-3xl mb-4">Popular Discussions</h1>
        <CreateDiscussion />
        <PostList posts={discussions} type="Discussion" />
      </div>
    </>
  );
}
