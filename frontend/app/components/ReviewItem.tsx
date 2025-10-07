import { Review } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";
import { formatDate } from "../utils/functions";
import CommentItem from "./CommentItem";
import Reactions from "./Reactions";
import CreateComment from "./CreateComment";
import Link from "next/link";
import TagItem from "./TagItem";
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
      <div className="card card-xs md:card-md card-side bg-base-100 w-full h-full shadow-sm">
        {/* game cover img Optional */}
        {showCover && (
          <figure className="flex-shrink-0 w-28 sm:w-44 h-32 sm:h-56">
            <GamePreviewLink game={review.game!} />
          </figure>
        )}

        <div className="card-body">
          {/* title */}
          <Link
            className="link link-hover"
            href={`/user/${review.profile?.username}/review/${review.id}`}
          >
            <h2 className="card-title text-lg line-clamp-2 text-pretty font-semibold">
              {review.title}
            </h2>
          </Link>

          <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-2 ">
            <div className="flex flex-col gap-2 ">
              {/* user info */}
              <div className="flex items-center justify-start gap-3">
                <img
                  className="size-8 rounded-box "
                  src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                />
                <Link
                  className="link link-hover"
                  href={`/user/${review.profile?.username}`}
                >
                  {review.profile?.username}
                </Link>

                <span> reviewed</span>
                <span className="font-semibold">{review.game?.name}</span>
              </div>
              {/* rating */}
              <div className="rating rating-half rating-sm">
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
              <p className="font-medium">{review.content}</p>
            </div>

            <div className="flex flex-row md:flex-col flex-shrink-0 md:text-right text-sm w-fit gap-2 opacity-50">
              <span>{formatDate(review.created_at!)}</span>
              <p>{review.platform}</p>
              <p>🕗 {review.hours_played}hrs</p>
            </div>
          </div>
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
            />
            {/* <CreateComment parentType={"review"} parentID={review.id} /> */}
          </div>
          {/* <CommentItem parentType="review" parentID={review.id} /> */}
        </div>
      </div>
    </>
  );
};
export default ReviewItem;
