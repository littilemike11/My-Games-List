import getGames from "@/app/api/igdb-api";
import { Game } from "@/app/types/models";
import { parseGame } from "@/app/utils/functions";
import Stats from "@/app/components/gamePage/Stats";
import Info from "@/app/components/gamePage/Info";
import CTA from "@/app/components/gamePage/CTA";
import TabSection from "@/app/components/gamePage/TabSection";
interface Props {
  params: { slug: string };
}

export default async function GamePage({ params }: Props) {
  const query = `fields cover.url, first_release_date, genres.name, name, platforms.name, storyline, summary, themes.name, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, screenshots.url, rating, rating_count, similar_games.name, similar_games.slug, similar_games.cover.url,hypes, franchises.games.name, franchises.games.slug, franchises.games.cover.url; where slug = "${params.slug}";`;
  const response = await getGames(query);
  console.log(response);
  const game: Game = parseGame(response[0]);
  console.log(game);

  return (
    <>
      {/* Main Section: Cover + Info */}

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          {/* Cover + Stats */}
          <div className="lg:col-span-3 space-y-4">
            {game.cover && (
              <img
                src={game.cover}
                alt={`${game.name} cover art`}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full mx-auto rounded-2xl shadow-lg object-cover"
              />
            )}
            <div>
              <Stats
                rating={game.rating}
                liked={game.liked || 0}
                ratingCount={game.ratingCount}
              />
            </div>
          </div>
          {/* Game Info Section */}
          <div className="lg:col-span-6 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pretty">
              {game.name}
            </h1>
            <p className="text-gray-400 text-sm">{game.release_date}</p>

            <div className="flex flex-col lg:flex-col-reverse">
              {/* <p className="text-md text-pretty">{game.storyline}</p> */}

              <div className=" py-6">
                <CTA game={game} />
              </div>
              {game.summary && (
                <p className="text-base sm:text-lg leading-relaxed text-pretty">
                  {game.summary}
                </p>
              )}
            </div>
          </div>
          {/* Sidebar Info */}
          <div className="lg:col-span-3">
            <Info
              genres={game.genres}
              platforms={game.platforms}
              themes={game.themes}
              developers={game.developers}
              publishers={game.publishers}
            />
          </div>
        </div>
        {/* tabs section */}
        {/* name of each tab group should be unique */}
        <TabSection
          screenshots={game.screenshots}
          franchise={game.franchise ?? []}
          similarGames={game.similarGames}
          reviews={game.reviews ?? []}
          discussions={game.discussions ?? []}
        />
      </div>
    </>
  );
}
