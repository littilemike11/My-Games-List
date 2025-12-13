"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import TagSection from "@/app/components/TagSection";
import {
  getOwnListByID,
  getUserGames,
  updateList,
} from "@/app/api/supabase-api/list-api";
import { useParams, useRouter } from "next/navigation";
import {
  GamePreview,
  List,
  ListVisibility,
  StatusKey,
} from "@/app/types/models";
import GamePreviewLink from "@/app/components/GamePreviewLink";
import GameSearch from "@/app/components/GameSearch";
import { profile } from "console";
// import { redirect } from "next/navigation";
export default function EditListForm({
  //   updatelist,
  userID,
  listID,
  initialTitle,
  initialDescription,
  initialTags,
  initialTagIds,
  initialGames,
  userGames,
}: {
  userID: string;
  listID: number;
  initialTitle: string;
  initialDescription: string;
  initialTags: string[];
  initialTagIds: number[];
  initialGames: GamePreview[];
  userGames: any;
}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [oldTagIds, setOldTagIds] = useState<number[]>(initialTagIds);
  const [games, setGames] = useState<any[]>(userGames);
  const [oldgames, setOldGames] = useState<GamePreview[]>(initialGames);
  //   const [oldList, setOldList] = useState<List | null>(null);
  const [filteredGames, setFilteredGames] = useState<any[]>(userGames);
  const [list, setList] = useState<GamePreview[]>(initialGames);
  //   const [loading, setloading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [visibility, setVisibility] = useState<ListVisibility>("public");
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🚫 stop page refresh

    setUpdating(true);
    try {
      if (!title || list.length == 0) return;
      //   update list
      console.log("oldtags", oldTagIds);
      const updatedList = await updateList(
        userID,
        listID,
        oldgames,
        list,
        oldTagIds,
        tags,
        {
          title,
          visibility,
          description,
        }
      );
      console.log("updated list:", updatedList);
      setOldTagIds(updatedList.tags);
      setOldGames(list);
      if (updatedList) {
        setUpdating(false);
        router.push(`/list/${listID}`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      console.log("Something went wrong. Check console for details.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div>
        <form className="max-w-3xl mx-auto my-8" onSubmit={handleSubmit}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend font-bold text-lg">
              Edit List
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
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

                <TagSection tags={tags} setTags={setTags} />
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
                {userID && (
                  <div className="flex flex-col gap-2">
                    <label className="label">
                      Choose from Preexisting Catalog
                    </label>
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
                        // <div key={game.game.id} className="h-20">
                        //   <GamePreviewLink game={game.game} />
                        // </div>
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
            <GameSearch onClickFunction={addGameToList} argumentType={"game"} />

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
            {list.length > 0 ? (
              <button
                type="submit"
                className="btn btn-success"
                aria-disabled={updating}
              >
                {updating ? "Updating ..." : "Save"}
              </button>
            ) : (
              <button disabled className="btn cursor-not-allowed">
                Add a game
              </button>
            )}
            <Link href={"/popular/lists"}>
              <button type="button" className="btn btn-error">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
