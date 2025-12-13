import { getReviewsByUser } from "@/app/api/supabase-api/review-api";
import { Review } from "@/app/types/models";
import { getPlayerByName } from "@/app/api/supabase-api/profile-api";
import ReviewItem from "@/app/components/ReviewItem";
interface ReviewsPageProps {
  params: Promise<{ name: string }>;
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { name } = await params;
  const username = name; // 👈 comes from /user/[name]/reviews
  const userID = await getPlayerByName(username);
  // if you want to fetch by userId instead of username, you’ll need a lookup here
  const reviews: Review[] = await getReviewsByUser(userID.id);

  return (
    <div className="mx-4 sm:mx-[2rem]">
      <h2 className="text-2xl mb-6 pb-2 border-b">
        {username}'s Reviews ({reviews.length})
      </h2>
      <div className="divider"></div>
      {reviews.length > 0 ? (
        <div className="flex flex-col space-y-10">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p>{username} has not posted any reviews yet</p>
      )}
    </div>
  );
}
