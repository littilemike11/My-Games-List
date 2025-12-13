import getGames from "@/app/api/igdb-api";
import { Game } from "@/app/types/models";
import { parseGame } from "@/app/utils/functions";
import Stats from "@/app/components/gamePage/Stats";
import Info from "@/app/components/gamePage/Info";
import CTA from "@/app/components/gamePage/CTA";
import TabSection from "@/app/components/gamePage/TabSection";
import { upsertGame } from "@/app/api/supabase-api/game-api";
import Paragraph from "@/app/components/Paragraph";
import GameHero from "@/app/components/GameHero";
import { notFound } from "next/navigation";
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;

  // use slug normally

  const query = `fields cover.url, first_release_date, genres.name, name, slug, platforms.name, storyline, summary, themes.name, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, screenshots.url, rating, rating_count, similar_games.name, similar_games.slug, similar_games.cover.url,hypes, franchises.games.name, franchises.games.slug, franchises.games.cover.url, videos.name, videos.video_id , artworks.url; where slug = "${slug}";`;
  const response = await getGames(query);
  console.log(response);
  let game: Game;
  let newGameID;
  if (response.length > 0) {
    game = parseGame(response[0]);
    newGameID = await upsertGame(game);
    console.log(newGameID.id);
    console.log(game);
  } else {
    notFound();
  }

  return (
    <>
      {/* HERO SECTION (artwork + title/date) */}
      {game.artwork?.[0] && (
        <GameHero
          bgImage={game.artwork[0]}
          heading={game.name}
          subHeading={game.release_date!}
          CTA={false}
        />
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
          <div className="col-span-12  md:col-span-5 space-y-6">
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
          <main className="col-span-12 md:order-3 ">
            <div className="flex flex-col md:flex-col-reverse gap-6">
              <CTA game={game} gameID={newGameID.id} />

              {game.summary && (
                // <p className="text-base leading-relaxed text-pretty">
                //   {game.summary}
                // </p>
                <Paragraph text={game.summary} />
              )}
            </div>
          </main>
          {/* game info (theme,genre,publisher , etc ...) */}
          <aside className="col-span-12 md:order-2 md:col-span-7 space-y-6">
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
          gameID={newGameID.id}
          game={game}
          screenshots={game.screenshots ?? []}
          artwork={game.artwork ?? []}
          videos={game.videos ?? []}
          franchise={game.franchise ?? []}
          similarGames={game.similarGames ?? []}
        />
      </div>
    </>
  );
}
