import Tabs from "@/app/components/Tabs";
import CreateDiscussion from "@/app/components/CreateDiscussion";
import { getDiscussions } from "@/app/api/supabase-api/discussion-api";
import DiscussionItem from "@/app/components/DiscussionItem";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discussions",
  description: "Browse discussions from the gaming community on The Save Room.",
  openGraph: {
    title: "Discussions",
    description: "Browse discussions from the gaming community.",
    url: "https://www.thesaveroom.co/popular/discussions",
    type: "website",
    // images: [
    //   {
    //     url: "/og-discussions.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Discussions",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Discussions",
    description: "Browse discussions from the gaming community.",
    // images: ["/og-discussions.png"],
  },

  robots: { index: true, follow: true },
};

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
