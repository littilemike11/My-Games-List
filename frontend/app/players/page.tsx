import { getDiscussions } from "../api/supabase-api/discussion-api";
import DiscussionItem from "../components/DiscussionItem";
export default async function PlayersPage() {
  const discussions = await getDiscussions();
  console.log(discussions);
  return (
    <>
      <h1>Players</h1>
    </>
  );
}
