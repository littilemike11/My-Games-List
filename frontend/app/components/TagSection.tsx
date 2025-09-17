"use client";
import { useState } from "react";
import GameSearch from "./GameSearch";

const TagSection: React.FC<{ canSearchGame?: boolean }> = ({
  canSearchGame = false,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const groupedTags = {
    "Popular Tags": ["Hot takes", "Hidden gems", "Controversial"],
    Genres: ["Action", "Puzzle", "Strategy", "Story"],
    Themes: ["Sci-fi", "Fantasy", "Horror"],
  };

  const addTag = (tag: string) => {
    console.log(tag);
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const clearTags = () => {
    setTags([]);
  };
  return (
    <>
      {/* Tag Input */}
      <label className="label">Tags</label>
      {canSearchGame && (
        <GameSearch onClickFunction={addTag} argumentType={"string"} />
      )}
      <div className="join mb-4 mt-2">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addTag(tagInput))
          }
          placeholder="Create a custom tag"
          className="input input-sm group join-item"
        />
        <button
          className="btn btn-sm join-item"
          type="button"
          onClick={() => addTag(tagInput)}
        >
          Add
        </button>
      </div>

      {/* Grouped Tag Buttons */}

      {Object.entries(groupedTags).map(([group, tagsInGroup]) => (
        <div key={group} className="mb-3">
          <h4 className="text-sm font-semibold text-secondary mb-1">{group}</h4>
          <div className="flex flex-wrap gap-2">
            {tagsInGroup.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`badge badge-outline  ${
                  tags.includes(tag)
                    ? "badge-accent"
                    : "hover:bg-base-300 hover:cursor-pointer"
                }`}
                onClick={() => addTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Display selected tags */}
      {tags.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="badge badge-outline badge-lg flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  className="text-error font-bold cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={clearTags}
            type="button"
            className="btn btn-ghost btn-sm mt-2"
          >
            clear
          </button>
        </div>
      )}
    </>
  );
};

export default TagSection;
