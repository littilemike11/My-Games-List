import { getReviews } from "@/app/api/supabase-api/review-api";
import PostList from "@/app/components/PostList";
import { Review } from "@/app/types/models";
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
