"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GamePreview } from "@/app/types/models";
import getGames from "@/app/api/igdb-api";
import GamePreviewLink from "@/app/components/GamePreviewLink";
const GameResultsPage = () => {
  const searchParams = useSearchParams();
  const [games, setGames] = useState<any[]>([]);

  const query = searchParams
    .get("q")
    ?.trim()
    .toLowerCase()
    .replace(/[\s+/]+/g, "-") // turn spaces, +, / into -
    .replace(/-+/g, "-"); // collapse multiple - into one

  useEffect(() => {
    const fetchGames = async () => {
      if (!query) return;
      try {
        let gameQuery = `fields id, name, slug, cover.url ; search "${query}"; limit 50;`;

        const response = await getGames(gameQuery);
        setGames(response);
      } catch (error) {
        console.error(`error fetching games with ${query}`, error);
      }
    };
    fetchGames();
  }, [query]);
  return (
    <>
      <main className="p-6 max-w-4xl mx-auto">
        {/* This could be a component that fetches & combines results */}

        <section>
          <div className="space-y-6">
            {/* Title */}
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold mb-2">
                Games matching <span className="text-primary">"{query}"</span>
              </h1>
              <p className="text-sm text-gray-500">
                {games.length} result{games.length !== 1 && "s"} found
              </p>
            </div>

            {/* Map your results here */}
            {/* <p>Games matching </p> */}
            {games.length > 0 ? (
              <div className="grid grid-cols-2 place-items-center md:grid-cols-3 lg:grid-cols-4 gap-4">
                {games.map((game) => (
                  <div className="" key={game.id}>
                    <GamePreviewLink
                      game={{
                        id: game.id,
                        slug: game.slug,
                        cover:
                          game.cover?.url.replace("t_thumb", "t_cover_big") ||
                          null,
                        name: game.name,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-error text-center mt-10 text-lg">
                No Games found
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};
export default GameResultsPage;
