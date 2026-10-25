"use client";

import { useEffect, useState } from "react";
import { getRandomQuote, QuoteType } from "../mockData/quotes";

const Quote: React.FC<{ type: QuoteType }> = ({ type }) => {
  const [quote, setQuote] = useState<{
    text: string;
    origin: string;
  } | null>(null);

  useEffect(() => {
    setQuote(getRandomQuote(type));
  }, [type]);

  if (!quote) return <div className="min-h-16" />;

  return (
    <div>
      <p className="text-center italic text-base sm:text-lg text-pretty">
        “{quote.text}”
      </p>
      <p className="mt-2 text-right text-secondary text-sm opacity-80">
        — {quote.origin}
      </p>
    </div>
  );
};

export default Quote;
