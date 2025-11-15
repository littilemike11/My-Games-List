import getGames from "@/app/api/igdb-api";
import { Game } from "@/app/types/models";
import { parseGame } from "@/app/utils/functions";
import Stats from "@/app/components/gamePage/Stats";
import Info from "@/app/components/gamePage/Info";
import CTA from "@/app/components/gamePage/CTA";
import TabSection from "@/app/components/gamePage/TabSection";
import { upsertGame } from "@/app/api/supabase-api/game-api";
interface Props {
  params: { slug: string };
}

export default async function GamePage({ params }: Props) {
  const query = `fields cover.url, first_release_date, genres.name, name, slug, platforms.name, storyline, summary, themes.name, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, screenshots.url, rating, rating_count, similar_games.name, similar_games.slug, similar_games.cover.url,hypes, franchises.games.name, franchises.games.slug, franchises.games.cover.url, videos.name, videos.video_id , artworks.url; where slug = "${params.slug}";`;
  const response = await getGames(query);
  console.log(response);
  const game: Game = parseGame(response[0]);
  const newGameID = await upsertGame(game);
  console.log(newGameID.id);
  console.log(game);

  return (
    <>
      {/* HERO SECTION (artwork + title/date) */}
      {game.artwork?.[0] && (
        <div className="relative w-full h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh] overflow-hidden rounded-2xl  bg-base-200">
          {/* Background image */}
          <img
            src={game.artwork[0]}
            alt={`${game.name} artwork`}
            className="absolute inset-0 w-full h-full "
            // object-center object-cover scale-110 sm:scale-105 transition-all
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b 
                  from-black/10 via-black/60 to-base-100/95 sm:to-base-100/70"
          />

          {/* Foreground text */}
          <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-8 lg:p-12">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md line-clamp-2">
              {game.name}
            </h1>
            <p className="text-gray-300 text-sm sm:text-lg drop-shadow">
              {game.release_date}
            </p>
          </div>
        </div>
      )}

      <div className="p-2">
        {/* Game title/date if no artwork */}
        {!game.artwork?.[0] && (
          <div className="flex flex-col pb-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md line-clamp-2">
              {game.name}
            </h1>
            <p className="text-gray-300 text-sm sm:text-lg drop-shadow">
              {game.release_date}
            </p>
          </div>
        )}
        <div className="grid  grid-cols-12 gap-8 mb-6">
          {/* 📀 Cover + Stats  (Right column on desktop) */}
          <div className="col-span-12  md:col-span-5 xl:col-span-3 space-y-6">
            {game.cover && (
              <img
                src={game.cover}
                alt={`${game.name} cover`}
                className="w-44 sm:w-56 mx-auto rounded-2xl shadow-lg object-cover"
              />
            )}
            <Stats
              rating={game.rating}
              liked={game.liked || 0}
              ratingCount={game.ratingCount}
            />
          </div>
          {/* 📝 CTA + Summary (Left column) */}
          <main className="col-span-12 md:order-3 xl:order-2 xl:col-span-6">
            <div className="flex flex-col md:flex-col-reverse gap-6">
              <CTA game={game} gameID={newGameID.id} />

              {game.summary && (
                <p className="text-base leading-relaxed text-pretty">
                  {game.summary}
                </p>
              )}
            </div>
          </main>
          {/* game info (theme,genre,publisher , etc ...) */}
          <aside className="col-span-12 md:order-2 md:col-span-7 xl:order-3 xl:col-span-3 space-y-6">
            <div className="border border-base-300 rounded-xl p-4">
              <Info
                genres={game.genres}
                platforms={game.platforms}
                themes={game.themes}
                developers={game.developers}
                publishers={game.publishers}
              />
            </div>
          </aside>
        </div>

        {/* tabs section */}
        {/* name of each tab group should be unique */}
        <TabSection
          game={game}
          screenshots={game.screenshots}
          franchise={game.franchise ?? []}
          similarGames={game.similarGames}
        />
      </div>
    </>
  );
}
