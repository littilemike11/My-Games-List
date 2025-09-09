import { getReviewsByUser } from "@/app/api/supabase-api/review-api";
import PostList from "@/app/components/PostList";
import { Review } from "@/app/types/models";
import { getPlayerByName } from "@/app/api/supabase-api/profile-api";
interface ReviewsPageProps {
  params: { name: string };
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const username = params.name; // 👈 comes from /user/[name]/reviews
  const userID = await getPlayerByName(username);
  // if you want to fetch by userId instead of username, you’ll need a lookup here
  const reviews: Review[] = await getReviewsByUser(userID.id);

  return (
    <div className="mx-4 sm:mx-[2rem]">
      <h2 className="text-2xl mb-4">
        {username}'s Reviews ({reviews.length})
      </h2>
      <div className="divider"></div>
      {reviews.length > 0 ? (
        <PostList posts={reviews} type="Review" />
      ) : (
        <p>{username} has not posted any reviews yet</p>
      )}
    </div>
  );
}
