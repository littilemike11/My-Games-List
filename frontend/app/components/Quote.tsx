const Quote: React.FC<{ content: string; origin?: string }> = ({
  content,
  origin,
}) => {
  return (
    <>
      <div className="quote">
        <p>{content}</p>
        {origin && <p className="text-right">- {origin}</p>}
      </div>
    </>
  );
};

export default Quote;
