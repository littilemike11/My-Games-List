import ReviewItem from "@/app/components/ReviewItem";
import { notFound } from "next/navigation";
import { getReviewByID } from "@/app/api/supabase-api/review-api";
import { Review } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
export default async function ReviewPage({
  params,
}: {
  params: { id: string };
}) {
  //   get review id
  const reviewID = Number(params.id);
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
