import Carousel from "./components/Carousel";
import PostList from "./components/PostList";
import { getReviews } from "./api/supabase-api/review-api";
import { getDiscussions } from "./api/supabase-api/discussion-api";
import getGames from "./api/igdb-api";
import { parseGamePreview } from "./utils/functions";
import { Discussion, GamePreview, Review } from "./types/models";
import CreateDiscussion from "./components/CreateDiscussion";

export default async function Home() {
  const todayTimestamp = Math.floor(Date.now() / 1000);

  const queries = [
    "fields cover.url, name, slug;where version_parent=null & rating > 85 ;sort rating_count desc; limit 10;",
    `
fields cover.url, name, slug;
where first_release_date < ${todayTimestamp} & version_parent = null & rating > 85;
sort first_release_date desc;
limit 10;`,
    `
fields cover.url, name, slug;
where first_release_date > ${todayTimestamp} & version_parent = null & hypes>50;
sort first_release_date asc;
limit 10;`,
  ];

  let popularGames: GamePreview[] = [];
  let recentGames: GamePreview[] = [];
  let anticipatedGames: GamePreview[] = [];
  let reviews: Review[] = [];
  let discussions: Discussion[] = [];
  try {
    const responses = await Promise.all(queries.map((q) => getGames(q)));
    popularGames = responses[0].map(parseGamePreview);
    recentGames = responses[1].map(parseGamePreview);
    anticipatedGames = responses[2].map(parseGamePreview);
    reviews = await getReviews();
    discussions = await getDiscussions();
    // const reviews = await getReviews();
    // console.log(reviews);
  } catch (error) {
    console.error("Failed to fetch home page games:", error);
  }

  return (
    <div className="flex flex-col gap-2 items-center md:mx-4 lg:mx-16">
      <h1 className="text-4xl text-pretty text-center font-bold">
        Welcome to <span className="italic">The Save Room</span>
      </h1>
      <h2 className="text-xl ">A community hub for gamers by gamers.</h2>
      <div className="my-5 ">
        <CreateDiscussion />
        {/* <p className=" mt-2 text-gray-400 ">
          Your personal space to log, reflect on, and discover games.
        </p> */}
      </div>

      {/* shows popular lists and members */}
      <Carousel title="Recent Releases" games={recentGames} />

      <PostList posts={reviews} type="Review" />
      <Carousel title="Classic Gems" games={popularGames} />

      <PostList posts={discussions} type="Discussion" />
      <Carousel title="Most Anticipated" games={anticipatedGames} />
    </div>
  );
}
