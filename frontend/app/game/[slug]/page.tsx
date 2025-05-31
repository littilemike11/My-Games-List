import getGames from "@/app/api";
import { Game } from "@/app/types/models";
import { parseGame } from "@/app/utils/functions";
interface Props {
  params: { slug: string };
}


export default async function GamePage({ params }: Props) {
    
    const query= `fields cover.url, first_release_date, genres.name, name, platforms.name, storyline, summary, themes.name, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, screenshots.url, rating, rating_count, similar_games.name, similar_games.slug, similar_games.cover.url,hypes, franchises.games.name, franchises.games.slug, franchises.games.cover.url; where slug = "${params.slug}";`
    const response = await getGames(query)
    console.log(response)
    const game :Game= parseGame(response[0])
    console.log(game)
    
  return (
    <>
     <div className="max-w-6xl mx-auto p-6 space-y-10">
  {/* Main Section: Cover + Info */}
  <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content border h-full flex-col lg:flex-row">
    {game.cover && (
      <div className="flex-shrink-0 w-full lg:w-1/3">
        <img
          src={game.cover}
          alt={`${game.name} cover art`}
          className="rounded-2xl shadow-lg w-full object-cover"
        />
      </div>
    )}
    <div>
      <h1 className="text-5xl font-bold">{game.name}</h1>
      <p className="py-6">
       {game.summary}
      </p>
      <div className="flex space-x-6">
        <button className="btn btn-primary">Write a Review</button>
        <button className="btn btn-primary">Add to List</button>
        <button className="btn btn-primary">Favorite</button>

      </div>
      
    </div>
  </div>
</div>
  <div className="flex flex-col lg:flex-row gap-8">
    {/* Cover Art */}
    {game.cover && (
      <div className="flex-shrink-0 w-full lg:w-1/3">
        <img
          src={game.cover}
          alt={`${game.name} cover art`}
          className="rounded-2xl shadow-lg w-full object-cover"
        />
      </div>
    )}

    {/* Game Info */}
    <div className="flex-1 space-y-4">
      <h1 className="text-4xl lg:text-5xl font-bold text-pretty">{game.name}</h1>
      <p className="text-gray-300 text-sm">Released: {game.release_date}</p>

      {game.storyline && (
        <p className="text-lg text-gray-200 leading-relaxed">{game.storyline}</p>
      )}

      {/* Rating / Stats */}
      <div className="text-sm text-gray-400 flex gap-6">
        <span>⭐ {game.rating.toFixed(0)} / 100</span>
        <span>👍 {game.liked ?? 0} liked</span>
        <span>🕹️ {game.ratingCount ?? 0} played</span>
      </div>


      <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-gray-400 uppercase text-sm">Genres</h2>
              <ul className="flex flex-wrap gap-2">
                {game.genres.map((genre, index) => (
                  <li className="badge badge-primary" key={index}>
                    {genre}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-gray-400 uppercase text-sm">Platforms</h2>
              <ul className="flex flex-wrap gap-2">
                {game.platforms.map((platform, index) => (
                  <li className="badge badge-secondary " key={index}>
                    {platform}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-gray-400 uppercase text-sm">Themes</h2>
              <ul className="flex flex-wrap gap-2">
                {game.themes.map((theme, index) => (
                  <li className="badge badge-accent" key={index}>
                    {theme}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-gray-400 uppercase text-sm">Developer</h2>
              <ul className="flex flex-wrap gap-2">
                {game.developers.map((developer, index) => (
                  <li className="badge badge-outline" key={index}>
                    {developer}
                  </li>
                ))}
              </ul>
            </div>
            { game.publishers && <div>
              <h2 className="font-semibold text-gray-400 uppercase text-sm">Publishers</h2>
              <ul className="flex flex-wrap gap-2">
                {game.publishers.map((publisher, index) => (
                  <li className="badge" key={index}>
                    {publisher}
                  </li>
                ))}
              </ul>
            </div>}
    </div>
    </div>
  </div>

  {/* Screenshots */}
  {game.screenshots.length > 0 && (
    <div>
      <h2 className="text-xl font-semibold mb-2">Screenshots</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {game.screenshots.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`screenshot-${index}`}
            className="rounded-xl shadow-md w-full object-cover"
          />
        ))}
      </div>
    </div>
  )}

{game.franchise && game.franchise?.length > 0 && (
    <div>
      <h2 className="text-xl font-semibold mb-2">Other Games in the Series</h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {game.franchise.map((game) => (
          <li key={game.id} className="bg-base-200 p-4 rounded-lg hover:bg-base-300 transition">
            <h3 className="text-lg font-bold">{game.name}</h3>
            {/* Optionally show simGame.cover if available */}
          </li>
        ))}
      </ul>
    </div>
  )}
  {/* Similar Games */}
  {game.similarGames.length > 0 && (
    <div>
      <h2 className="text-xl font-semibold mb-2">Similar Games</h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {game.similarGames.map((simGame) => (
          <li key={simGame.id} className="bg-base-200 p-4 rounded-lg hover:bg-base-300 transition">
            <h3 className="text-lg font-bold">{simGame.name}</h3>
            {/* Optionally show simGame.cover if available */}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  

    </>
    );
}
