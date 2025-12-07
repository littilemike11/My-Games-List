"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { useParams } from "next/navigation";
import {
  updateList,
  getUserGames,
  getOwnListByID,
} from "@/app/api/supabase-api/list-api";
import {
  GamePreview,
  List,
  ListVisibility,
  StatusKey,
} from "@/app/types/models";
import GamePreviewLink from "@/app/components/GamePreviewLink";
import Link from "next/link";
import TagSection from "@/app/components/TagSection";
import GameSearch from "@/app/components/GameSearch";
import Custom404 from "@/app/components/Custom404";
const page = () => {
  const { id } = useParams<{ id: string }>();
  const [tags, setTags] = useState<string[]>([]);
  const [oldTagIds, setOldTagIds] = useState<number[]>([]);
  const { session, profile } = useAuth();
  const [games, setGames] = useState<any[]>([]);
  const [oldgames, setOldGames] = useState<GamePreview[]>([]);
  const [oldList, setOldList] = useState<List | null>(null);
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [list, setList] = useState<GamePreview[]>([]);
  const [loading, setloading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ListVisibility>("public");
  const userID = session?.user.id;

  useEffect(() => {
    const getList = async () => {
      if (!userID) return;
      const response = await getOwnListByID(+id, userID);
      setOldList(response);
      setOldTagIds(response?.tags?.flatMap((tag) => tag.id) ?? []);
      console.log("oldtags", oldTagIds);
      setTags(response?.tags?.flatMap((tag) => tag.name) ?? []);
      setDescription(response?.description ?? "");
      setVisibility(response?.visibility ?? "public");
      setTitle(response?.title ?? "");
      setList(response?.games ?? []);
      setOldGames(response?.games ?? []);
      setloading(false);
    };
    getList();
  }, [userID]);

  const handleSubmit = async (e: React.FormEvent) => {
    setUpdating(true);
    e.preventDefault(); // 🚫 stop page refresh
    try {
      if (!title || !list || !session) {
        console.log("missing something");
        return;
      }
      //   update list
      if (userID && list.length > 0) {
        console.log("oldtags", oldTagIds);
        const updatedList = await updateList(
          userID,
          +id,
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
      }
      setUpdating(false);
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
      getGames();
    }
  }, [profile]);

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
  {
    if (loading) {
      return (
        <>
          <div className="flex w-96 flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
            <div className="skeleton h-48 w-full"></div>
          </div>
        </>
      );
    } else if (oldList && !loading) {
      return (
        <>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          {/* <button className="btn" onClick={openModal}>
        open modal
      </button> */}

          <form onSubmit={handleSubmit}>
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
                  {session && (
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
                          <div key={game.game.id} className="h-20">
                            <GamePreviewLink game={game.game} />
                          </div>
                          //   <div
                          //     className="hover:scale-105 transition-transform duration-200 "
                          //     key={game.game.id}
                          //     title={game.game?.name}
                          //     onClick={() => addGameToList(game.game)}
                          //   >
                          //     <img
                          //       className="w-full h-20 object-cover cursor-pointer"
                          //       src={game.game?.cover}
                          //       alt={`${game.game?.name} cover`}
                          //     />
                          //   </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <label className="label">Games</label>
              <GameSearch
                onClickFunction={addGameToList}
                argumentType={"game"}
              />

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
                <button type="submit" className="btn btn-success">
                  {updating ? "Updating ..." : "Save"}
                </button>
              ) : (
                <button disabled className="btn cursor-not-allowed">
                  Add a game
                </button>
              )}
              <Link href={`/user/${profile?.username}`}>
                <button type="button" className="btn btn-error">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </>
      );
    } else {
      return (
        <>
          <Custom404 title="404 | List not Found" />;
        </>
      );
    }
  }
};

export default page;
