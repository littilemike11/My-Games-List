type RatingInputProps = {
  value: number;
  onChange: (rating: number) => void;
};

const RatingInput: React.FC<RatingInputProps> = ({ value, onChange }) => {
  const ratings = Array.from({ length: 20 }, (_, i) => (i + 1) * 0.5); // [0.5, 1, 1.5, ..., 10]

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="rating rating-lg rating-half">
          {ratings.map((val, index) => (
            <input
              key={index}
              type="radio"
              name="rating-11"
              className={`mask mask-star-2 ${
                index % 2 === 0 ? "mask-half-1" : "mask-half-2"
              } bg-green-500`}
              aria-label={`${val} star`}
              checked={value === val}
              onChange={() => onChange(val)}
            />
          ))}
        </div>
        <span className="text-lg">{value} /10</span>
      </div>
    </>
  );
};

export default RatingInput;
