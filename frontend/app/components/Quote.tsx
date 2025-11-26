const Quote: React.FC<{ content: string; origin?: string }> = ({
  content,
  origin,
}) => {
  return (
    <>
      <div className="quote ">
        <p className="italic text-base sm:text-lg text-pretty">“{content}”</p>
        {origin && (
          <p className="mt-2 text-right text-secondary text-sm opacity-70">
            — {origin}
          </p>
        )}
      </div>
    </>
  );
};

export default Quote;
