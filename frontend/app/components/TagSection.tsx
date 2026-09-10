"use client";
import { useState, useEffect } from "react";
import GameSearch from "./GameSearch";
import { genres, genreSlugs } from "../mockData/genreTags";
import { themes, themeSlugs } from "../mockData/themeTags";
import restrictedTags from "../mockData/restrictedTags";
import { getPopularTags } from "../api/supabase-api/tag-api";
import { Tag } from "../types/models";
import { searchTags } from "../api/supabase-api/tag-api";
import { useAuth } from "../auth/auth-context";

import { FaLock } from "react-icons/fa";

const TagSection: React.FC<{
  canSearchGame?: boolean;
  recommendedTags?: string[];
  lockedTags?: string[];
  tags: string[];
  setTags: Function;
}> = ({
  canSearchGame = false,
  recommendedTags = [],
  lockedTags = [],
  tags,
  setTags,
}) => {
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [error, setError] = useState(false);
  const { profile } = useAuth();

  // const [tags, setTags] = useState<string[]>(recommendedTags);
  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchPopularTags = async () => {
      const response = await getPopularTags(5, "usage", "desc");
      // remove restricted tags
      setPopularTags(response.map((tag) => tag.name));
    };
    fetchPopularTags();
  }, []);
  const toggleExpand = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const LIMIT = 4; // max tags to show initially

  const groupedTags =
    recommendedTags.length > 0
      ? {
          Recommended: recommendedTags,
        }
      : {
          "Popular Tags": popularTags,
          "Give Back": ["player-feedback", "bug-report"],
          Genres: genreSlugs,
          Themes: themeSlugs,
        };

  const addTag = (tag: string) => {
    if (restrictedTags.includes(tag) && !profile?.is_admin) {
      setError(true);
      return;
    }
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed.toLocaleLowerCase()]);
    }
    setTagInput("");
    setSearchResults([]);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const clearTags = () => {
    lockedTags ? setTags(lockedTags) : setTags([]);
  };

  const updateSearch = async () => {
    try {
      const response = await searchTags(tagInput);
      console.log("tags search", response);
      setSearchResults(response);
      console.log(searchResults);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setError(false);
    const delay = setTimeout(() => {
      if (tagInput.length > 0) updateSearch();
    }, 400); // wait 400ms after typing stops
    return () => clearTimeout(delay);
  }, [tagInput]);
  return (
    <>
      {/* Tag Input */}
      <label className="label">Tags</label>
      {canSearchGame && (
        <GameSearch onClickFunction={addTag} argumentType={"string"} />
      )}
      {error && <p className="text-error">This is restricted tag</p>}

      <div className="join mb-4 mt-2  ">
        <div className="group relative w-full">
          <input
            value={tagInput}
            onChange={(e) =>
              setTagInput(
                e.target.value.replace(/[^a-zA-Z0-9_-]/g, "-"), // remove disallowed chars - make it slug safe
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag(tagInput))
            }
            type="search"
            placeholder="Add a tag"
            className="input join-item w-full"
          />
          <div
            className="absolute bg-amber-50 top-12 z-50 w-full rounded shadow 
                  opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible
                  transition-opacity duration-200"
          >
            <ul className="text-gray-700">
              {searchResults.length > 0 ? (
                searchResults.map((tag) => (
                  <li key={tag.id} className="hover:bg-amber-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addTag(tag.name);
                      }}
                      className="flex w-full h-full p-1 cursor-pointer items-center space-x-2"
                    >
                      <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2.5"
                          fill="none"
                          stroke="currentColor"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.3-4.3"></path>
                        </g>
                      </svg>
                      <span className="capitalize">{tag.name}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="p-2">No tags found</li>
              )}
            </ul>
          </div>
        </div>
        <button
          className="btn join-item"
          type="button"
          onClick={() => addTag(tagInput)}
        >
          {searchResults.length > 0 ? "add" : "create"}
        </button>
      </div>

      {/* Grouped Tag Buttons */}

      {Object.entries(groupedTags).map(([group, tagsInGroup]) => {
        const expanded = expandedGroups[group] || false;
        const visibleTags = expanded
          ? tagsInGroup
          : tagsInGroup.slice(0, LIMIT);

        return (
          <div key={group} className="mb-3">
            <h4 className="text-sm font-semibold text-secondary mb-1">
              {group}
            </h4>
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag: string) => (
                <button
                  key={tag}
                  type="button"
                  className={`badge badge-outline ${
                    tags.includes(tag || genres[tag])
                      ? "badge-accent"
                      : "hover:bg-base-300 hover:cursor-pointer"
                  }`}
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            {tagsInGroup.length > LIMIT && (
              <button
                type="button"
                className=" btn btn-ghost btn-sm mt-2"
                onClick={() => toggleExpand(group)}
              >
                {expanded ? "Hide" : "See More ..."}
              </button>
            )}
          </div>
        );
      })}

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
                {lockedTags.includes(tag) ? (
                  <FaLock />
                ) : (
                  <button
                    type="button"
                    className="text-error font-bold cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          <button
            onClick={clearTags}
            type="button"
            className="btn btn-ghost btn-sm mt-2 block"
          >
            clear
          </button>
        </div>
      )}
    </>
  );
};

export default TagSection;
