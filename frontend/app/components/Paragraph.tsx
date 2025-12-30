"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Paragraph: React.FC<{ text: string }> = ({ text }) => {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

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
      <div className="grid grid-cols-1 ">
        {/* <div
          ref={textRef}
          className={`prose prose-sm sm:prose lg:prose-lg max-w-none  text-base leading-relaxed text-pretty transition-all ${
            showMore ? "line-clamp-none" : "line-clamp-6"
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div> */}

        <article
          ref={textRef}
          className={`prose prose-sm sm:prose w-fit
                   break-words overflow-wrap-anywhere
                   prose-p:my-2 prose-h1:my-3 prose-h2:my-3 prose-h3:my-2
                   prose-ul:my-2 prose-ol:my-2
                   prose-pre:whitespace-pre-wrap prose-pre:break-words
                   prose-code:break-words
                   prose-img:max-w-full prose-img:h-auto
                   ${showMore ? "line-clamp-none" : "line-clamp-6"}`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ ...props }) => (
                <img {...props} className="max-w-full h-auto rounded-md" />
              ),
              pre: ({ ...props }) => (
                <pre
                  {...props}
                  className="max-w-full rounded-md bg-base-200  p-2 sm:p-3 w-80whitespace-pre    break-words       "
                />
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </article>

        {shouldShowButton && (
          <button
            type="button"
            className="btn  btn-sm mt-2 w-fit self-start"
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
