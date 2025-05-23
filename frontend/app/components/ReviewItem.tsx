import { Review } from "../types/models";

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  const formattedDate = new Date(review.date).toLocaleDateString();
  const ratings = [];
  for (let i = 1; i <= 10; i++) {
    ratings.push(i / 2);
  }
  console.log(ratings);
  return (
    <>
      <div className="card sm:card-side bg-base-100 border w-full h-56 shadow-sm">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
            alt="Album"
          />
        </figure>
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <h2 className="card-title text-lg font-semibold">{review.title}</h2>
            <span className="text-sm opacity-50">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-start gap-3">
            <img
              className="size-8 rounded-box "
              src="https://img.daisyui.com/images/profile/demo/1@94.webp"
            />
            <span>{review.userID}</span>
            <span className="font-semibold">{review.gameID}</span>
          </div>
          <div className="rating rating-half">
            {ratings.map((rating, index) => (
              <div
                key={index}
                className={`mask mask-star-2 bg-green-500 ${
                  index % 2 == 0 ? "mask-half-1" : "mask-half-2"
                }`}
                aria-label={`${rating} star`}
                aria-checked={rating == review.rating}
              />
            ))}
          </div>
          <p>{review.text}</p>
          <div className="card-actions">
            <div className="flex items-center gap-4 text-sm ">
              <div className="flex items-center gap-1">
                <button className="btn btn-ghost btn-square size-8">👍</button>
                <span>{review.likes}</span>
              </div>

              <div className="flex items-center gap-1">
                <button className="btn btn-ghost btn-square size-8">👎</button>
                <span>{review.dislikes}</span>
              </div>

              <div className="flex items-center gap-1">
                <button className="btn btn-ghost btn-square size-8">💬</button>
                <span>{review.comments?.length} comments</span>
              </div>
              {/* <button className="btn btn-primary">Listen</button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReviewItem;
