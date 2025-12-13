import Tabs from "@/app/components/Tabs";
import CreateDiscussion from "@/app/components/CreateDiscussion";
import { getDiscussions } from "@/app/api/supabase-api/discussion-api";
import DiscussionItem from "@/app/components/DiscussionItem";
export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const sort =
    (resolvedSearchParams.sort as "likes" | "comments" | "date") ?? "likes";

  const order = (resolvedSearchParams.order as "asc" | "desc") ?? "desc";

  const discussions = await getDiscussions(50, sort, order);

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl text-pretty text-center font-bold">
          Discussions
        </h1>
        <Tabs />
        <CreateDiscussion />
        <div className="flex flex-col gap-4">
          {discussions.map((discussion) => (
            <DiscussionItem key={discussion.id} discussion={discussion} />
          ))}
        </div>
      </div>
    </>
  );
}
