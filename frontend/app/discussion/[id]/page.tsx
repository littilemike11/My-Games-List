import DiscussionItem from "@/app/components/DiscussionItem";
import { notFound } from "next/navigation";
import { getDiscussionByID } from "@/app/api/supabase-api/discussion-api";
import { Discussion } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const discussion = await getDiscussionByID(Number(params.id));
  if (!discussion) return { title: "discussion not found" };

  return {
    title: discussion.title,
    description: discussion.content.slice(0, 160),
    openGraph: {
      title: discussion.title,
      description: discussion.content.slice(0, 160),
      url: `https://www.thesaveroom.co/discussion/${params.id}`,
      type: "article",
      // images: [
      //   {
      //     url: discussion.game.cover || "/default-discussion-og.png",
      //     width: 1200,
      //     height: 630,
      //   },
      // ],
    },
    twitter: {
      card: "summary_large_image",
      title: discussion.title,
      description: discussion.content.slice(0, 160),
      // images: [discussion.game.cover || "/default-discussion-og.png"],
    },
    robots: { index: true, follow: true },
  };
}
export default async function DiscussionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  //   get discussion id
  const discussionID = Number(id);
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
