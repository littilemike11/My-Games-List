"use client";
import { useState, useEffect } from "react";
import { GamePreview } from "../types/models";
import getGames from "../api/igdb-api";
const GameSearch: React.FC<{
  // game can either be a string for tags(discussion) or GamePreview for games(list)
  argumentType: "string" | "game";
  onClickFunction: (game: any) => void;
}> = ({ onClickFunction, argumentType }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<GamePreview[]>([]);

  const handleClick = (game: any) => {
    if (argumentType == "string") {
      onClickFunction(game.slug);
    } else {
      onClickFunction(game);
    }
    setSearchInput("");
  };

  const updateSearch = async () => {
    const query = `
    fields id, name, slug, cover.url;
    search "${searchInput}";
    where version_parent = null;
    limit 10;
  `;

    const result = await getGames(query);
    console.log(result);
    const formattedResult = result.map((game: any) => ({
      id: game.id,
      slug: game.slug,
      cover: game.cover?.url.replace("t_thumb", "t_cover_big") || null,
      name: game.name,
    }));
    setSearchResults(formattedResult);
  };
  // Search trigger optimization (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchInput.length > 2) updateSearch();
    }, 400); // wait 400ms after typing stops
    return () => clearTimeout(delay);
  }, [searchInput]);
  return (
    <>
      <div className="w-full lg:w-96 flex justify-end relative group">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Search a game to add"
          className="input input-bordered w-full"
        />

        {/* Dropdown shows only when input is focused */}
        <div
          className="absolute bg-amber-50 top-12 z-50 w-full rounded shadow 
                  opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible
                  transition-opacity duration-200"
        >
          <ul className="text-gray-700">
            {searchInput.length < 3 ? (
              <li className="p-2 border-b">
                Please enter 3 or more characters
              </li>
            ) : searchResults.length > 0 ? (
              searchResults.map((game) => (
                <li key={game.id} className="hover:bg-amber-100">
                  <button
                    type="button"
                    onClick={() => handleClick(game)}
                    className="flex w-full cursor-pointer items-center gap-2 p-2"
                  >
                    {game.cover && (
                      <img
                        className="h-12 w-8 object-cover rounded"
                        src={game.cover}
                        alt={`${game.name} cover`}
                      />
                    )}
                    <p className="font-bold line-clamp-1">{game.name}</p>
                  </button>
                </li>
              ))
            ) : (
              <li className="p-2">No games found</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default GameSearch;
