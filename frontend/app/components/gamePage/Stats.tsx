type StatsProps = {
  rating: number;
  liked: number;
  ratingCount: number;
};
const Stats: React.FC<StatsProps> = ({ rating, liked, ratingCount }) => {
  const starCount = [];
  // ****** MAY NEED MORE ACCURATE STAR SYSTEM***********
  for (let i = 1; i <= 20; i++) {
    starCount.push(i / 2);
    console.log(starCount);
    console.log(Math.round(rating / 5) / 2);
  }
  return (
    <>
      <div className="text-sm opacity-80 flex flex-col">
        <div className="flex justify-center items-center space-x-5">
          <div className="rating rating-half">
            {starCount.map((star, index) => (
              <div
                key={index}
                className={`mask mask-star-2 bg-green-500 ${
                  index % 2 == 0 ? "mask-half-1" : "mask-half-2"
                }`}
                aria-label={`${star} star`}
                aria-checked={star == Math.round(rating / 5) / 2}
              />
            ))}
          </div>
          <div className="stat-value">{Math.round(rating * 2) / 20}</div>
        </div>

        <div className="flex justify-around">
          {/* <span>⭐ {rating.toFixed(0)} / 100</span> */}
          <span>👍 {liked ?? 0} likes</span>
          <span>🕹️ {ratingCount ?? 0} played</span>
        </div>
      </div>
    </>
  );
};

export default Stats;
