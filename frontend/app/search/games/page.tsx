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
      <main className="p-4">
        {/* This could be a component that fetches & combines results */}
        <div className="space-y-6">
          <section>
            <h1 className="text-2xl font-bold">
              Games matching "{query}" ({games.length})
            </h1>

            {/* Map your results here */}
            {/* <p>Games matching </p> */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          </section>
        </div>
      </main>
    </>
  );
};
export default GameResultsPage;
