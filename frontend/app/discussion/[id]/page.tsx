import DiscussionItem from "@/app/components/DiscussionItem";
import { notFound } from "next/navigation";
import { getDiscussionByID } from "@/app/api/supabase-api/discussion-api";
import { Discussion } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
export default async function DiscussionPage({
  params,
}: {
  params: { id: string };
}) {
  //   get discussion id
  const discussionID = Number(params.id);
  if (isNaN(discussionID)) return notFound();
  //   get discussion info
  const discussion: Discussion | null = await getDiscussionByID(discussionID);
  if (!discussion) {
    return notFound();
  }

  return (
    <>
      <div className="my-8">
        <DiscussionItem discussion={discussion} />
        {/* comments of disscussion */}
        <CommentSection parentType={"discussion"} parentID={discussionID} />
      </div>
    </>
  );
}
