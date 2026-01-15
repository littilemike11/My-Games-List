import ReviewItem from "@/app/components/ReviewItem";
import { notFound } from "next/navigation";
import { getReviewByID } from "@/app/api/supabase-api/review-api";
import { Review } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const reviewID = Number(id);
  const review = await getReviewByID(reviewID);
  if (!review) return { title: "Review not found" };

  return {
    title: review.title,
    description: review.content.slice(0, 160),
    openGraph: {
      title: `${review.game.name} Review`,
      description: review.content.slice(0, 160),
      url: `https://www.thesaveroom.co/review/${reviewID}`,
      type: "article",
      images: [
        {
          url: review.game.cover || "/default-review-og.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${review.game.name} Review`,
      description: review.content.slice(0, 160),
      images: [review.game.cover || "/default-review-og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //   get review id
  const { id } = await params;

  const reviewID = Number(id);
  if (isNaN(reviewID)) return notFound();
  //   get review info
  const review: Review | null = await getReviewByID(reviewID);
  if (!review) {
    return notFound();
  }

  return (
    <>
      <div className="my-8">
        <ReviewItem review={review} />
        {/* comments of review */}
        <CommentSection parentType={"review"} parentID={reviewID} />
      </div>
    </>
  );
}
