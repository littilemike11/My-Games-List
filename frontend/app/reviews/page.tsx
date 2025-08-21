import { getReviews } from "../api/supabase-api/review-api";
import PostList from "../components/PostList";
import { Review } from "../types/models";
export default async function ReviewsPage() {
  const reviews: Review[] = await getReviews();
  return (
    <>
      <div className="mx-4 sm:mx-[2rem]">
        <h1 className="text-3xl mb-4">Popular Reviews</h1>
        <PostList posts={reviews} type="Review" />
      </div>
    </>
  );
}
