import { Review } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";
import { formatDate } from "../utils/functions";
const ReviewItem: React.FC<{ review: Review; showCover?: boolean }> = ({
  review,
  showCover = true,
}) => {
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
            <GamePreviewLink game={review.games!} />
          </figure>
        )}

        <div className="card-body">
          {/* title */}
          <h2 className="card-title text-lg line-clamp-2 text-pretty font-semibold">
            {review.title}
          </h2>
          <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-2 ">
            <div className="flex flex-col gap-2 ">
              {/* user info */}
              <div className="flex items-center justify-start gap-3">
                <img
                  className="size-8 rounded-box "
                  src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                />
                <span>{review.profiles?.username} reviewed</span>
                <span className="font-semibold">{review.games?.name}</span>
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

              <p>{review.content}</p>
              {/* CTAs */}
              <div className="card-actions">
                <div className="flex items-center gap-4 text-sm ">
                  <div className="flex items-center gap-1">
                    <button className="btn btn-ghost btn-square size-8">
                      👍
                    </button>
                    <span>{review.likes}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="btn btn-ghost btn-square size-8">
                      👎
                    </button>
                    <span>{review.dislikes}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="btn btn-ghost btn-square size-8">
                      💬
                    </button>
                    <span>{review.comments?.length} comments</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col flex-shrink-0 md:text-right text-sm w-fit gap-2 opacity-50">
              <span>{formatDate(review.created_at!)}</span>
              <p>{review.platform}</p>
              <p>🕗 {review.hours_played}hrs</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReviewItem;
