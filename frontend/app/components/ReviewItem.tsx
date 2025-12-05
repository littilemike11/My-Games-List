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

  return (
    <>
      <div className="card card-side bg-base-100 w-full h-full rounded-lg border border-base-200 hover:shadow-lg shadow-sm transition-all duration-200">
        {/* game cover img Optional */}
        {showCover && (
          <figure className="flex-shrink-0 w-24 sm:w-40 h-32 sm:h-52">
            <GamePreviewLink game={review.game!} />
          </figure>
        )}

        <div className="card-body">
          {/* title */}
          <div className="flex justify-between">
            <Link
              className="link link-hover decoration-primary"
              href={`/user/${review.profile?.username}/review/${review.id}`}
            >
              <h2 className="card-title text-primary line-clamp-2 text-pretty font-bold">
                {review.title}
              </h2>
            </Link>
            <div>
              <PostOptions
                postType="review"
                postID={review.id}
                ownerID={review.profile?.id}
                ownerName={review.profile.username}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 ">
            <div className="flex flex-col gap-2 ">
              {/* user info */}
              <div>
                <Link
                  className="link link-hover"
                  href={`/user/${review.profile?.username}`}
                >
                  <div className="flex items-baseline">
                    <div className="avatar avatar-placeholder">
                      <div className="bg-neutral text-neutral-content w-8 rounded-full">
                        <span>{review.profile?.username[0].toUpperCase()}</span>
                      </div>
                    </div>

                    <span className="ml-2 w-full font-medium italic">
                      {review.profile?.username || "(deleted)"}
                    </span>
                  </div>
                </Link>
                {/* 
                <span> reviewed</span>
                <span className="font-semibold">{review.game?.name}</span> */}
              </div>
              {/* rating */}
              <div className="rating rating-half rating-xs">
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
            </div>

            <div className="flex text-pretty flex-col flex-shrink-0 h-fit text-sm w-fit gap-2 opacity-50">
              <span>
                {formatDate(review.created_at!)}, 🕗 {review.hours_played}hrs
              </span>
              <span>{review.platform}</span>
              {/* <span>🕗 {review.hours_played}hrs</span> */}
            </div>
          </div>
          <div className="font-medium">
            <Paragraph text={review.content} />
          </div>
          {/* <p className="font-medium">{review.content}</p> */}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {review.tags?.map((tag) => (
              <TagItem key={tag.id} tag={tag} />
            ))}
          </div>
          {/* CTAs */}
          <div className=" card-actions items-center">
            <Reactions
              likeCount={review.likes ?? 0}
              dislikeCount={review.dislikes ?? 0}
              commentCount={review.comment_count ?? 0}
              parent_type="review"
              parent_id={review.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ReviewItem;
