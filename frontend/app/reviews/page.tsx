import { getReviews } from "../api/supabase-api/review-api";
import ReviewItem from "../components/ReviewItem";
import { Review } from "../types/models";
export default async function ReviewsPage() {
  const reviews: Review[] = await getReviews();
  console.log(reviews);
  return (
    <>
      <h1>Reviews</h1>
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-2">
        {reviews.map((review, index) => (
          <ReviewItem key={index} review={review} />
        ))}
      </div>
    </>
  );
}
