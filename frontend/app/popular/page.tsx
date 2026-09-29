export const dynamic = "force-dynamic"; // prevent caching so that reactions can be updated

import Carousel from "../components/Carousel";
import { getReviews } from "../api/supabase-api/review-api";
import { getDiscussions } from "../api/supabase-api/discussion-api";
import { getLists } from "../api/supabase-api/list-api";
import getGames, { getTwitchGames, getVideos } from "../api/igdb-api-server";
import { getEvents, getStreams } from "../api/igdb-api-server";
import {
  parseGamePreview,
  parseEvent,
  parseStream,
  parseVideo,
} from "../utils/functions";
import {
  Discussion,
  EventDetails,
  GamePreview,
  List,
  Review,
  StreamDetails,
  VideoDetails,
} from "../types/models";
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
import EventShowcase from "../components/EventShowcase";
import TwitchStreamShowcase, {
  TrendingGameHighlight,
} from "../components/TwitchStreamShowcase";

export const metadata: Metadata = {
  title: "Popular",
  description:
    "Browse the most trending content in the community on The Save Room",
};

export default async function Home() {
  const todayTimestamp = Math.floor(Date.now() / 1000);
  console.log(todayTimestamp);

  const gameQueries = [
    // classic
    "fields cover.url, name, slug;where version_parent=null & rating > 85 ;sort rating_count desc; limit 10;",
    // trending/popular
    `
    
fields cover.url, name, slug, artworks.url;
where first_release_date < ${todayTimestamp} & version_parent = null & hypes > 75;
sort first_release_date desc;
limit 10;`,
    // most antipated
    `
fields cover.url, name, slug;
where first_release_date > ${todayTimestamp} & version_parent = null & hypes>50;
sort first_release_date asc;
limit 10;`,
    // recent
    `
fields cover.url, name, slug, artworks.url;
where first_release_date < ${todayTimestamp} & version_parent = null & rating > 75;
sort first_release_date desc;
limit 10;`,
  ];
  const recentEventsQuery = `
  fields name, description, event_logo.*, event_networks.*, start_time, time_zone, live_stream_url; 
  where start_time < ${todayTimestamp};
  sort start_time desc ;
  limit 6;
`;

  const upcomingEventsQuery = `
  fields name, description, event_logo.*, event_networks.*, start_time, time_zone, live_stream_url;
  where start_time > ${todayTimestamp};
  sort start_time asc;
  limit 6;
`;

  let popularGames: GamePreview[] = [];
  let trendingGames: GamePreview[] = [];
  let anticipatedGames: GamePreview[] = [];
  let recentGames: GamePreview[] = [];

  let reviews: Review[] = [];
  let discussions: Discussion[] = [];
  let lists: List[] = [];
  let artworks: any = [];
  let recentEvents: EventDetails[] = [];
  let upcomingEvents: EventDetails[] = [];
  let trendingStreams: StreamDetails[] = [];
  let trendingVods: VideoDetails[] = [];
  let trendingHighlights: TrendingGameHighlight[] = [];

  let randomQuote =
    welcomeQuotes[Math.floor(Math.random() * welcomeQuotes.length)];
  const heading = (
    <>
      Welcome to <span className="italic">The Save Room</span>
    </>
  );

  try {
    const [
      gameResponses,
      reviewsRes,
      discussionsRes,
      listsRes,
      recentEventsRes,
      upcomingEventsRes,
      // trendingStreamRes,
    ] = await Promise.all([
      Promise.all(gameQueries.map((q) => getGames(q))), // array of game arrays
      getReviews(5, "date"),
      getDiscussions(5, "date"),
      getLists(5, "date"),
      getEvents(recentEventsQuery),
      getEvents(upcomingEventsQuery),
      // getStreams(21779),
    ]);

    // Parse game groups
    popularGames = gameResponses[0].map(parseGamePreview);
    trendingGames = gameResponses[1].map(parseGamePreview);
    anticipatedGames = gameResponses[2].map(parseGamePreview);
    recentGames = gameResponses[3].map(parseGamePreview);

    // trendingStreams = (
    //   await Promise.all(
    //     trendingGames.map(async (game) => ({
    //       game,
    //       streams: await getStreams(String(game.id)),
    //     })),
    //   )
    // ).filter(({ streams }) => streams.length > 0);
    // trendingStreams = (
    //   await Promise.all(gameResponses[1].map((game) => getStreams(game.id)))
    // ).flat();

    gameResponses[1].forEach((game: any) => {
      if (game.artworks) {
        artworks.push(game.artworks?.[0].url);
        return;
      }
    });

    // Get Posts
    reviews = reviewsRes;
    discussions = discussionsRes;
    lists = listsRes;

    // events
    recentEvents = recentEventsRes.map(parseEvent);
    upcomingEvents = upcomingEventsRes.map(parseEvent);

    // Streams
    // trendingStreams = trendingStreamRes.map(parseStream);
    console.log(gameResponses[1]);
    try {
      const twitchIDs = await getTwitchGames(
        trendingGames.map((game) => game.id),
      );

      const twitchByIgdbId = new Map(
        twitchIDs.map((twitchGame) => [String(twitchGame.igdb_id), twitchGame]),
      );

      trendingHighlights = await Promise.all(
        trendingGames.map(async (game) => {
          const twitchGame = twitchByIgdbId.get(String(game.id));
          if (!twitchGame) {
            return {
              game,
              streams: [],
              videos: [],
            };
          }

          const [streams, videos] = await Promise.all([
            getStreams(twitchGame.id),
            getVideos(twitchGame.id),
          ]);

          return {
            game,
            streams: streams.map(parseStream),
            videos: videos.map(parseVideo),
          };
        }),
      );
    } catch (error) {
      console.log("error", error);
    }
    console.log("trending highlights:", trendingHighlights);
  } catch (error) {
    console.error("Failed to fetch home page games:", error);
  }

  return (
    <div className="flex flex-col gap-2 items-center ">
      {/* Above the Folde */}
      <GameHero
        bgImage={artworks[Math.floor(Math.random() * artworks.length)].replace(
          "t_thumb",
          "t_original",
        )}
        heading={heading}
        subHeading="A Community Hub for Gamers by Gamers"
      />
      <Quote content={randomQuote.text} origin={randomQuote.origin} />
      <Tabs />
      {/* Above the Fold */}
      {/* shows popular lists and members */}
      {/* <Carousel
        title="What's the Meta?"
        link="/games/hype/75/sort/date_desc"
        games={trendingGames}
      /> */}
      <TwitchStreamShowcase highlights={trendingHighlights} />
      {/* popular reviews */}
      <section className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          From the Community
        </h2>
        <div className="grid grid-cols-1 ">
          {/* Reviews */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">
              Trending Reviews
            </h3>
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
          </div>
          {/* Discussions */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">
              Trending Discussions
            </h3>
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
          </div>
        </div>
      </section>

      {/* Discover */}
      <Carousel
        title="Most Recent"
        games={recentGames}
        link="games/rating/75/sort/date_desc"
      />

      <Carousel
        title="Most Anticipated"
        games={anticipatedGames}
        link="/games/decade/upcoming/hype/50/sort/date_asc"
      />

      {/* events */}
      <section className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Events
        </h2>
        <div className="grid grid-cols-1 ">
          {/* maybe highlight single events for full width */}
          <EventShowcase title="Upcoming Events" events={upcomingEvents} />

          <EventShowcase title="Recent Events" events={recentEvents} />
        </div>
      </section>

      {/* popular lists */}
      <section className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          Trending Lists
        </h2>
        <div className="mt-4 flex flex-col space-y-10 ">
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
      <WhyUsSection />

      <Carousel
        title="Classic Gems"
        games={popularGames}
        link="/games/rating/85/sort/rating_count_desc"
      />
      {/* possibly add top players/tags + add recent games carousel */}
    </div>
  );
}
