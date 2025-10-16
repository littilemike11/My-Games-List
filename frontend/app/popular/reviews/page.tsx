import Tabs from "@/app/components/Tabs";
import ReviewItem from "@/app/components/ReviewItem";
import { Review } from "@/app/types/models";
import { getReviews } from "@/app/api/supabase-api/review-api";
export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string };
}) {
  const sort = (searchParams.sort as "likes" | "comments" | "date") || "likes";
  const order = (searchParams.order as "asc" | "desc") || "desc";

  const reviews: Review[] = await getReviews(50, sort, order);

  return (
    <>
      <div>
        <h1 className="text-4xl text-pretty text-center font-bold">Reviews</h1>
        <Tabs />
        <div className="flex flex-col space-y-10">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      </div>
    </>
  );
}
