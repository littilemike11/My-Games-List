export const dynamic = "force-dynamic"; // prevent caching so that reactions can be updated

import Carousel from "../components/Carousel";
import { getReviews } from "../api/supabase-api/review-api";
import { getDiscussions } from "../api/supabase-api/discussion-api";
import { getLists } from "../api/supabase-api/list-api";
import getGames from "../api/igdb-api";
import { parseGamePreview } from "../utils/functions";
import { Discussion, GamePreview, List, Review } from "../types/models";
import Tabs from "../components/Tabs";
import ReviewItem from "../components/ReviewItem";
import DiscussionItem from "../components/DiscussionItem";
import ListItem from "../components/ListItem";
import GameHero from "../components/GameHero";
import Quote from "../components/Quote";
import { welcomeQuotes } from "../mockData/quotes";
import WhyUsSection from "../components/WhyUsSection";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popular",
  description:
    "Browse the most trending content in the community on The Save Room",
};

export default async function Home() {
  const todayTimestamp = Math.floor(Date.now() / 1000);
  console.log(todayTimestamp);

  const queries = [
    "fields cover.url, name, slug;where version_parent=null & rating > 85 ;sort rating_count desc; limit 10;",
    `
fields cover.url, name, slug, artworks.url;
where first_release_date < ${todayTimestamp} & version_parent = null & hypes > 75;
sort first_release_date desc;
limit 10;`,
    `
fields cover.url, name, slug;
where first_release_date > ${todayTimestamp} & version_parent = null & hypes>50;
sort first_release_date asc;
limit 10;`,
    `
fields cover.url, name, slug, artworks.url;
where first_release_date < ${todayTimestamp} & version_parent = null & rating > 75;
sort first_release_date desc;
limit 10;`,
  ];

  let popularGames: GamePreview[] = [];
  let trendingGames: GamePreview[] = [];
  let anticipatedGames: GamePreview[] = [];
  let recentGames: GamePreview[] = [];

  let reviews: Review[] = [];
  let discussions: Discussion[] = [];
  let lists: List[] = [];
  let artworks: any = [];
  let randomQuote =
    welcomeQuotes[Math.floor(Math.random() * welcomeQuotes.length)];
  const heading = (
    <>
      Welcome to <span className="italic">The Save Room</span>
    </>
  );

  try {
    const [gameResponses, reviewsRes, discussionsRes, listsRes] =
      await Promise.all([
        Promise.all(queries.map((q) => getGames(q))), // array of game arrays
        getReviews(5, "date"),
        getDiscussions(5, "date"),
        getLists(5, "date"),
      ]);

    // Parse game groups
    popularGames = gameResponses[0].map(parseGamePreview);
    trendingGames = gameResponses[1].map(parseGamePreview);
    anticipatedGames = gameResponses[2].map(parseGamePreview);
    recentGames = gameResponses[3].map(parseGamePreview);

    gameResponses[1].forEach((game: any) => {
      if (game.artworks) {
        artworks.push(game.artworks?.[0].url);
      }
    });

    // Assign other results
    reviews = reviewsRes;
    discussions = discussionsRes;
    lists = listsRes;
  } catch (error) {
    console.error("Failed to fetch home page games:", error);
  }

  return (
    <div className="flex flex-col gap-2 items-center ">
      <GameHero
        bgImage={artworks[Math.floor(Math.random() * artworks.length)].replace(
          "t_thumb",
          "t_original"
        )}
        heading={heading}
        subHeading="A Community Hub for Gamers by Gamers"
      />
      <Quote content={randomQuote.text} origin={randomQuote.origin} />
      <Tabs />
      {/* shows popular lists and members */}
      <Carousel title="What's the Meta?" games={trendingGames} />
      <WhyUsSection />
      {/* popular reviews */}
      <section className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Trending Reviews
        </h2>
        <div className="flex flex-col space-y-10">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
        <div className="flex justify-end w-full my-2">
          <Link className="link link:hover" href={`/popular/reviews`}>
            view more reviews...
          </Link>
        </div>
      </section>

      <Carousel title="Classic Gems" games={popularGames} />
      {/* popular discussions */}
      <section className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Trending Discussions
        </h2>
        <div className="flex flex-col space-y-10">
          {discussions.map((discussion) => (
            <DiscussionItem key={discussion.id} discussion={discussion} />
          ))}
        </div>
        <div className="flex justify-end w-full my-2">
          <Link className="link link:hover" href={`/popular/discussions`}>
            view more discussions...
          </Link>
        </div>
      </section>

      <Carousel title="Most Anticipated" games={anticipatedGames} />

      {/* popular lists */}
      <section className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Trending Lists
        </h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {lists.map((list, index) => (
            <ListItem key={index} list={list} />
          ))}
        </div>
        <div className="flex justify-end w-full my-2">
          <Link className="link link:hover" href={`/popular/lists`}>
            view more lists...
          </Link>
        </div>
      </section>
      <Carousel title="Most Recent" games={recentGames} />

      {/* possibly add top players/tags + add recent games carousel */}
    </div>
  );
}
