"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { createList, getUserGames } from "@/app/api/supabase-api/list-api";
const page = () => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { session, profile, loading } = useAuth();
  const [games, setGames] = useState<string[]>([]);
  const [gameInput, setGameInput] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const userID = session?.user.id;
  const handleSubmit = async () => {
    try {
      if (!title || !content || !session) return;
      const result = {};
      //   const result = await createDiscussion({
      //     user_id: session.user.id,
      //     title,
      //     content,
      //     tags,
      //   });

      console.log("Created discussion:", result);
      // maybe close modal or reset form here
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Something went wrong. Check console for details.");
    }
  };
  const cancel = () => {};

  const getGames = async () => {
    if (userID) {
      const response = await getUserGames(userID);
      console.log(response);
    }
  };

  useEffect(() => {
    if (profile) {
      setTitle(`${profile.username}'s List`);
      getGames();
    }
  }, [profile]);

  const groupedTags = {
    "Popular Tags": ["Hot takes", "Hidden gems", "Controversial"],
    Genres: ["Action", "Puzzle", "Strategy", "Story"],
    Themes: ["Sci-fi", "Fantasy", "Horror"],
  };

  const addTag = (tag: string) => {
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

  const addGame = (game: string) => {
    const trimmed = game.trim();
    if (trimmed && !games.includes(trimmed)) {
      setGames([...games, trimmed]);
      setGameInput("");
    }
  };

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      {/* <button className="btn" onClick={openModal}>
        open modal
      </button> */}

      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend font-bold text-lg">
            New List
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 ">
            <div className="flex flex-col gap-2">
              <label className="label">List Title</label>

              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="input"
                value={title}
                required
                autoFocus
              />

              <label className="label">Visibility</label>
              <select
                required
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="select"
              >
                <option value="public">Public</option>
                <option value="public">Friends Only</option>
                <option value="public">Private</option>
              </select>

              {/* Tag Input */}

              <label className="label">Tags</label>
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-secondary">
                      {group}
                    </span>
                    <div className="flex-1 border-t border-base-300"></div>
                  </div>

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
            </div>
            <div className="flex flex-col ">
              <label className="label">Description</label>
              <textarea
                className="textarea w-full h-40"
                placeholder="What is this list about"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                required
              />
            </div>
          </div>
          <label className="label">Games</label>
          <div className="join mb-4 mt-2">
            <input
              value={gameInput}
              onChange={(e) => setGameInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addGame(gameInput))
              }
              placeholder="Add Games"
              className="input input-sm group join-item"
            />
            <button
              className="btn btn-sm btn-primary join-item"
              type="button"
              onClick={() => addGame(gameInput)}
            >
              Add to List
            </button>
          </div>
          {/* current list */}
          <div className="bg-base-300 w-full h-32">{games}</div>
        </fieldset>
        <div className="modal-action flex justify-between w-full">
          <button type="submit" className="btn btn-success">
            Save
          </button>
          <button type="button" onClick={cancel} className="btn btn-error">
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default page;
