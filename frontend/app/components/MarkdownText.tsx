import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownText: React.FC<{ text: string; setText: any }> = ({
  text,
  setText,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const apply = (before: string, after = "") => {
    if (!textareaRef.current) return;
    const updated = insertMarkdown(textareaRef.current, before, after);
    setText(updated);
  };
  function insertMarkdown(
    textarea: HTMLTextAreaElement,
    before: string,
    after = ""
  ) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);

    const newText =
      textarea.value.slice(0, start) +
      before +
      selectedText +
      after +
      textarea.value.slice(end);

    textarea.value = newText;

    // restore cursor
    const cursorPos = start + before.length + selectedText.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.focus();

    return newText;
  }

  return (
    <div className="tabs tabs-lift ">
      {/* WRITE TAB */}
      <input
        type="radio"
        name="md_tabs"
        className="tab"
        aria-label="Write"
        defaultChecked
      />
      <div className="tab-content  bg-base-100 border-base-300 p-2 space-y-2">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 ">
          <div className="tooltip tooltip-bottom" data-tip="Bold">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => apply("**", "**")}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="currentColor"
                display="inline-block"
                overflow="visible"
              >
                <path d="M4 2h4.5a3.501 3.501 0 0 1 2.852 5.53A3.499 3.499 0 0 1 9.5 14H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 7v3h4.5a1.5 1.5 0 0 0 0-3Zm3.5-2a1.5 1.5 0 0 0 0-3H5v3Z"></path>
              </svg>
            </button>
          </div>
          <div className="tooltip tooltip-bottom" data-tip="Italic">
            <button
              type="button"
              className="btn btn-sm italic"
              onClick={() => apply("_", "_")}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="currentColor"
                display="inline-block"
                overflow="visible"
              >
                <path d="M6 2.75A.75.75 0 0 1 6.75 2h6.5a.75.75 0 0 1 0 1.5h-2.505l-3.858 9H9.25a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.505l3.858-9H6.75A.75.75 0 0 1 6 2.75Z"></path>
              </svg>
            </button>
          </div>
          <div className="tooltip tooltip-bottom" data-tip="Strikethrough">
            <button
              type="button"
              className="btn btn-sm line-through"
              onClick={() => apply("~", "~")}
            >
              S
            </button>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="Heading 1">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => apply("# ")}
            >
              H1
            </button>
          </div>
          <div className="tooltip tooltip-bottom" data-tip="Heading 2">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => apply("## ")}
            >
              H2
            </button>
          </div>
          <div className="tooltip tooltip-bottom" data-tip="Heading 3">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => apply("### ")}
            >
              H3
            </button>
          </div>
          <div className="tooltip tooltip-bottom" data-tip="Quote">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => apply("> ")}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="currentColor"
                display="inline-block"
                overflow="visible"
              >
                <path d="M1.75 2.5h10.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Zm4 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5ZM2.5 7.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 1.5 0Z"></path>
              </svg>
            </button>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="Link">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => apply("[", "](url)")}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="currentColor"
                display="inline-block"
                overflow="visible"
              >
                <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
              </svg>
            </button>
          </div>
          <div className="tooltip tooltip-bottom" data-tip="Image">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => apply("![", "](url)")}
            >
              🖼️
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="textarea w-full min-h-[160px] "
          placeholder="What are your thoughts? Pros and Cons?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>

      {/* PREVIEW TAB */}
      <input type="radio" name="md_tabs" className="tab" aria-label="Preview" />
      <div className="tab-content bg-base-100 border-base-300 p-2">
        {/* <article className="w-full  prose ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text ? text : "Nothing to preview"}
          </ReactMarkdown>
        </article> */}
        <article
          className="prose prose-sm sm:prose !max-w-full !mx-0 w-full
                           break-words overflow-wrap-anywhere
                           prose-p:my-2 prose-h1:my-3 prose-h2:my-3 prose-h3:my-2
                           prose-ul:my-2 prose-ol:my-2
                           prose-pre:whitespace-pre-wrap prose-pre:break-words
                           prose-code:break-words
                           prose-img:max-w-full prose-img:h-auto"
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
            {text ? text : "Nothing to preview"}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default MarkdownText;

/*
# Markdown Test
## Font Styles
### Example 1: Bold
**Bold**
### Example 2: Italics
_Italics_
### Example 3: Strikethrough
~Strikethrough~
## Inserts
### Example 1: Block Quote
> It’s time to kick ass and chew bubblegum… and I’m all outta gum.
### Example 2: Link
[_The Save Room_](https://www.thesaveroom.co/popular)
### Example 2: Image
![controller](https://target.scene7.com/is/image/Target/GUEST_fc9f79b6-0ce1-4ca5-aa25-3a61e939ca73?wid=300&hei=300&fmt=pjpeg)

# Raw text for markdown above
```
# Markdown Test
## Font Styles
### Example 1: Bold
**Bold**
### Example 2: Italics
_Italics_
### Example 3: Strikethrough
~Strikethrough~
## Inserts
### Example 1: Block Quote
> It’s time to kick ass and chew bubblegum… and I’m all outta gum.
### Example 2: Link
[_The Save Room_](https://www.thesaveroom.co/popular)
### Example 2: Image
![controller](https://target.scene7.com/is/image/Target/GUEST_fc9f79b6-0ce1-4ca5-aa25-3a61e939ca73?wid=300&hei=300&fmt=pjpeg)
```
*/
