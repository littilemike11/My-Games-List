"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Paragraph: React.FC<{ text: string; isPost?: boolean }> = ({
  text,
  isPost = true,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const lineClampmax = isPost ? "line-clamp-6" : "line-clamp-4";

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Temporarily remove the clamp to measure full height
    el.classList.remove(lineClampmax);
    const fullHeight = el.scrollHeight;

    // Apply clamp again to measure clamped height
    el.classList.add(lineClampmax);
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
        {isPost ? (
          <article
            ref={textRef}
            className={`prose-sm sm:prose !max-w-full !mx-0 w-full
             break-words overflow-wrap-anywhere
             prose-p:my-1 prose-h1:my-3 prose-h2:my-3 prose-h3:my-2
             prose-ul:my-2 prose-ol:my-2
             prose-pre:whitespace-pre-wrap prose-pre:break-words
             prose-code:break-words
             prose-img:max-w-full prose-img:h-auto
             
             ${showMore ? "line-clamp-none" : lineClampmax}`}
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
                    className="max-w-full !bg-base-200 rounded-md p-2 sm:p-3 w-full whitespace-pre  break-words       "
                  />
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </article>
        ) : (
          <p
            ref={textRef}
            className={`text-sm opacity-90 ${showMore ? "line-clamp-none" : lineClampmax}`}
          >
            {text}
          </p>
        )}

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
