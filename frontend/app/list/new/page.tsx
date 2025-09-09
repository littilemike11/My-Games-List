"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/auth-context";
import {
  batchAddGamesToList,
  createList,
  getUserGames,
} from "@/app/api/supabase-api/list-api";
import { GamePreview, ListVisibility, StatusKey } from "@/app/types/models";
import GamePreviewLink from "@/app/components/GamePreviewLink";
import Link from "next/link";
const page = () => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { session, profile, loading } = useAuth();
  const [games, setGames] = useState<any[]>([]);
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [list, setList] = useState<GamePreview[]>([]);

  const [gameInput, setGameInput] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ListVisibility>("public");
  const userID = session?.user.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🚫 stop page refresh
    try {
      console.log(!list);
      if (!title || !list || !session) {
        console.log("missing something");
        return;
      }
      if (userID) {
        const newList = await createList({
          title,
          tags,
          visibility,
          description,
          user_id: userID,
        });
        console.log("Created list:", newList);

        const game_ids = list.map((game) => game.id);
        if (newList && game_ids.length > 0) {
          const insertedGames = await batchAddGamesToList(game_ids, newList.id);
          console.log("Inserted games:", insertedGames);
        }
      }

      // maybe close modal or reset form here
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      console.log("Something went wrong. Check console for details.");
    }
  };

  const getGames = async () => {
    if (userID) {
      const response = await getUserGames(userID);
      setGames(response);
      setFilteredGames(response);
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

  const searchGame = (game: string) => {
    const newGame = game.trim();
    // if (newGame && !list.includes(newGame)) {
    //   setList([...list, newGame]);
    //   setGameInput("");
    // }
  };
  const addGameToList = (game: GamePreview) => {
    setList([...list, game]);
  };

  const removeGame = (gameID: number) => {
    if (gameID) setList((prev) => prev.filter((game) => game.id != gameID));
  };

  const handleFilter = (gameStatus?: StatusKey) => {
    if (gameStatus) {
      setFilteredGames(games.filter((game) => game[gameStatus]));
    } else {
      setFilteredGames(games);
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
                onChange={(e) =>
                  setVisibility(e.target.value as ListVisibility)
                }
                className="select"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
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
            <div className="flex flex-col gap-1 ">
              <label className="label">Description</label>
              <textarea
                className="textarea w-full h-40"
                placeholder="What is this list about"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              {/* game status */}
              {session && (
                <div className="flex flex-col gap-2">
                  <label className="label">Choose from Preexisting lists</label>
                  <div className="filter gap-2">
                    <input
                      className="btn btn-square"
                      type="reset"
                      value="×"
                      onClick={() => handleFilter()}
                    />
                    <input
                      className="btn btn-accent"
                      type="radio"
                      name="frameworks"
                      aria-label="Wishlist"
                      onClick={() => handleFilter("wishlist")}
                    />
                    <input
                      className="btn btn-accent"
                      type="radio"
                      name="frameworks"
                      aria-label="Favorite"
                      onClick={() => handleFilter("favorite")}
                    />
                    <input
                      className="btn btn-accent"
                      type="radio"
                      name="frameworks"
                      aria-label="Played"
                      onClick={() => handleFilter("played")}
                    />
                    <input
                      className="btn btn-accent"
                      type="radio"
                      name="frameworks"
                      aria-label="Playing"
                      onClick={() => handleFilter("playing")}
                    />
                  </div>
                  {/* current games */}
                  <div className="bg-base-100  w-full p-2 overflow-auto justify-around  flex gap-2 flex-wrap">
                    {filteredGames.map((game) => (
                      <div
                        className="hover:scale-105 transition-transform duration-200 "
                        key={game.game.id}
                        title={game.game?.name}
                        onClick={() => addGameToList(game.game)}
                      >
                        <img
                          className="w-full h-20 object-cover cursor-pointer"
                          src={game.game?.cover}
                          alt={`${game.game?.name} cover`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <label className="label">Games</label>
          <div className="join mb-4 mt-2">
            <input
              value={gameInput}
              onChange={(e) => setGameInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), searchGame(gameInput))
              }
              placeholder="Add Games"
              className="input input-sm group join-item"
            />
            <button
              className="btn btn-sm btn-primary join-item"
              type="button"
              onClick={() => searchGame(gameInput)}
            >
              Add to List
            </button>
          </div>
          {/* current list */}
          <div className="bg-base-300 w-full h-full">
            {list.map((game) => (
              <div
                key={game.id}
                className="flex border justify-between items-center my-2"
              >
                <div className="flex">
                  <img
                    className=" h-20 object-cover"
                    src={game?.cover}
                    alt={`${game?.name} cover`}
                  />
                  <h3 className="text-3xl font-bold">{game.name}</h3>
                </div>
                <button
                  onClick={() => removeGame(game.id)}
                  className="btn btn-ghost btn-xl"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="modal-action flex justify-between w-full">
          <button type="submit" className="btn btn-success">
            Save
          </button>
          <Link href={`/user/${profile?.username}`}>
            <button type="button" className="btn btn-error">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </>
  );
};

export default page;
