"use client";
import { useState, useEffect, useRef } from "react";

const Paragraph: React.FC<{ text: string }> = ({ text }) => {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Temporarily remove the clamp to measure full height
    el.classList.remove("line-clamp-6");
    const fullHeight = el.scrollHeight;

    // Apply clamp again to measure clamped height
    el.classList.add("line-clamp-6");
    const clampedHeight = el.clientHeight;

    // If full content height is greater than clamped height → show button
    setShouldShowButton(fullHeight > clampedHeight);
  }, [text]);

  const toggleExpand = () => setShowMore((prev) => !prev);

  return (
    <section>
      <div className="flex flex-col">
        <p
          ref={textRef}
          className={`text-base leading-relaxed text-pretty transition-all ${
            showMore ? "line-clamp-none" : "line-clamp-6"
          }`}
        >
          {text}
        </p>

        {shouldShowButton && (
          <button
            type="button"
            className="btn btn-ghost btn-sm mt-2 self-start"
            onClick={toggleExpand}
          >
            {showMore ? "Hide" : "See More ..."}
          </button>
        )}
      </div>
    </section>
  );
};

export default Paragraph;
