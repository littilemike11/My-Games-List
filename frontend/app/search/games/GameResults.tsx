"use client";

import GamePreviewLink from "@/app/components/GamePreviewLink";

interface Props {
  query: string;
  games: any[];
}

export default function GameResults({ query, games }: Props) {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <section className="space-y-6">
        {/* Title */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">
            Games matching <span className="text-primary">"{query}"</span>
          </h1>
          <p className="text-sm text-gray-500">
            {games.length} result{games.length !== 1 && "s"} found
          </p>
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <GamePreviewLink
                key={game.id}
                game={{
                  id: game.id,
                  slug: game.slug,
                  cover:
                    game.cover?.url?.replace("t_thumb", "t_cover_big") ?? null,
                  name: game.name,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-error text-center mt-10 text-lg">No games found</p>
        )}
      </section>
    </main>
  );
}
