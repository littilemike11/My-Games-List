import { Review } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";
import { formatDate } from "../utils/functions";
import Reactions from "./Reactions";
import Link from "next/link";
import TagItem from "./TagItem";
import Paragraph from "./Paragraph";
import PostOptions from "./PostOptions";
const ReviewItem: React.FC<{ review: Review; showCover?: boolean }> = ({
  review,
  showCover = true,
}) => {
  console.log(review);
  const ratings = [];
  for (let i = 1; i <= 20; i++) {
    ratings.push(i / 2);
  }
  console.log(review);

  return (
    <>
      <article className="w-full rounded-lg border border-base-200 bg-base-100 shadow-sm transition-shadow hover:shadow-md overflow-hidden">
        {/* ================= HEADER ================= */}
        <div className="flex gap-3 p-3 sm:p-4">
          {/* Game cover */}
          {showCover && (
            <figure className="w-20 sm:w-24 aspect-[3/4] shrink-0 overflow-hidden rounded-md">
              <GamePreviewLink game={review.game!} />
            </figure>
          )}

          {/* Review metadata */}
          <div className="min-w-0 flex-1">
            {/* Title + options */}
            <div className="flex items-start gap-2">
              <Link href={`/review/${review.id}`} className="min-w-0 flex-1">
                <h2 className="font-bold text-base sm:text-lg leading-tight text-primary line-clamp-2 link link-hover decoration-primary">
                  {review.title}
                </h2>
              </Link>

              <PostOptions
                postType="review"
                postID={review.id}
                ownerID={review.profile.id}
                ownerName={review.profile.username}
              />
            </div>

            {/* Author + date */}
            <div className="mt-1 text-xs sm:text-sm opacity-70">
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content w-6 rounded-full">
                  <span>{review.profile?.username[0].toUpperCase()}</span>
                </div>
              </div>
              <Link
                href={`/user/${review.profile?.username}`}
                className="font-medium hover:underline"
              >
                @{review.profile?.username || "deleted"}
              </Link>

              <span className="mx-1">·</span>

              <span>{formatDate(review.created_at!)}</span>
            </div>

            {/* Rating + metadata */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
              {/* Rating */}
              <div
                className="rating rating-half rating-xs"
                aria-label={`Rating: ${review.rating} out of 10`}
              >
                {[...Array(20)].map((_, index) => {
                  const rating = (index + 1) / 2;

                  return (
                    <div
                      key={index}
                      className={`mask mask-star-2 bg-green-500 ${
                        index % 2 === 0 ? "mask-half-1" : "mask-half-2"
                      }`}
                      aria-label={`${rating} star`}
                      aria-checked={rating === review.rating}
                    />
                  );
                })}
              </div>

              {/* Numeric rating */}
              <span className="font-semibold">{review.rating}/10</span>

              <span className="opacity-50">•</span>

              <span>{review.platform}</span>

              <span className="opacity-50">•</span>

              <span>{review.hours_played} hrs</span>
            </div>
          </div>
        </div>

        {/* ================= REVIEW ================= */}
        <div className="border-t border-base-200 px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="text-sm sm:text-base leading-relaxed">
            <Paragraph text={review.content} />
          </div>

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {review.tags.map((tag) => (
                <TagItem key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          {/* Reactions */}
          <div className="mt-3 flex items-center">
            <Reactions
              likeCount={review.likes ?? 0}
              dislikeCount={review.dislikes ?? 0}
              commentCount={review.comment_count ?? 0}
              parent_type="review"
              parent_id={review.id}
            />
          </div>
        </div>
      </article>
    </>
  );
};
export default ReviewItem;
