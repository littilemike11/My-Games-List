import Carousel from "./components/Carousel";
import PostList from "./components/PostList";
import { exampleReviews } from "./mockData/reviews";
import { exampleDiscussions } from "./mockData/discussions";
import getGames from "./api";
import { parseGamePreview } from "./utils/functions";
import { GamePreview } from "./types/models";
import CreateDiscussion from "./components/CreateDiscussion";

export default async function Home() {
  const queries = [
    "fields cover.url, first_release_date, genres.name, name, platforms.name, slug, storyline, summary, themes.name;where version_parent=null & rating > 90 ;sort rating_count desc;",
    "fields cover.url, first_release_date, genres.name, name, platforms.name, slug, storyline, summary, themes.name;where first_release_date < 1747948800 & version_parent=null & rating > 90 ;sort first_release_date desc;",
  ];

  let popularGames: GamePreview[] = [];
  let recentGames: GamePreview[] = [];

  try {
    const responses = await Promise.all(queries.map((q) => getGames(q)));
    popularGames = responses[0].map(parseGamePreview);
    recentGames = responses[1].map(parseGamePreview);
  } catch (error) {
    console.error("Failed to fetch home page games:", error);
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-3xl">Welcome to My Games List.</h1>
      <h2 className="mt-5 text-xl">A game review site for gamers by gamers.</h2>
      <CreateDiscussion />
      <Carousel title="Popular" games={popularGames} />
      <Carousel title="Recent" games={recentGames} />
      <PostList posts={exampleReviews} type="Review" />
      <PostList posts={exampleDiscussions} type="Discussion" />
    </div>
  );
}
