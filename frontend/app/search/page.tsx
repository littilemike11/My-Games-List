"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Quote from "../components/Quote";
import { useEffect, useState } from "react";
import getGames from "../api/igdb-api";
import Carousel from "../components/Carousel";
import { searchPlayers } from "../api/supabase-api/profile-api";
import { searchDiscussions } from "../api/supabase-api/discussion-api";
import { searchTags } from "../api/supabase-api/tag-api";
import { searchReviews } from "../api/supabase-api/review-api";
import {
  Discussion,
  GamePreview,
  List,
  Profile,
  Review,
  Tag,
} from "../types/models";
import TagItem from "../components/TagItem";
import ReviewItem from "../components/ReviewItem";
import { searchLists } from "../api/supabase-api/list-api";
import { ProfileItem } from "../components/ProfileItem";
import DiscussionItem from "../components/DiscussionItem";
import ListItem from "../components/ListItem";
const Page = () => {
  const searchParams = useSearchParams();
  const query = searchParams
    .get("q")
    ?.trim()
    .toLowerCase()
    .replace(/[\s+/]+/g, "-") // turn spaces, +, / into -
    .replace(/-+/g, "-"); // collapse multiple - into one

  const [games, setGames] = useState<GamePreview[]>([]);
  const [players, setPlayers] = useState<Profile[]>([]);
  const [discussions, setDiscissions] = useState<Discussion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!query) return;
    let gameQuery = `fields id, name, slug, cover.url ; search "${query}"; limit 10;`;
    Promise.all([
      getGames(gameQuery),
      searchPlayers(query),
      searchDiscussions(query),
      searchReviews(query),
      searchLists(query),
      searchTags(query, true),
    ]).then(([games, players, discussions, reviews, lists, tags]) => {
      setGames(games);
      setPlayers(players);
      setDiscissions(discussions);
      setReviews(reviews);
      setLists(lists);
      setTags(tags);
    });
  }, [query]);

  if (query) {
    // Render "All" search results
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          Search results for: <span className="text-primary">"{query}"</span>
        </h1>

        {/* This could be a component that fetches & combines results */}
        <div className="space-y-6">
          {/* Games */}
          <section>
            <h2 className="text-xl font-semibold">Games</h2>
            {/* Map your results here */}
            <p>Games matching "{query}"...</p>
            {games.length > 0 ? (
              <div className="my-4">
                <Carousel
                  games={games.map((game: any) => ({
                    id: game.id,
                    slug: game.slug,
                    cover:
                      game.cover?.url.replace("t_thumb", "t_cover_big") || null,
                    name: game.name,
                  }))}
                />
                <Link
                  className="link link:hover"
                  href={`/search/games?q=${query}`}
                >
                  view more games..
                </Link>
              </div>
            ) : (
              <p className="text-error">No games found</p>
            )}
          </section>

          {/* Players */}
          <section>
            <h2 className="text-xl font-semibold">Players</h2>
            <p>Players matching "{query}"...</p>
            {players.length > 0 ? (
              <div>
                <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
                  {players.map((p) => (
                    <ProfileItem key={p.id} profile={p} />
                  ))}
                </div>
                <Link
                  className="link link:hover"
                  href={`/search/players?q=${query}`}
                >
                  view more players..
                </Link>
              </div>
            ) : (
              <p className="text-error">No players found</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold">Discussions</h2>
            <p>Discussions matching "{query}"...</p>
            {discussions.length > 0 ? (
              <div>
                <ul className="my-4 list space-y-5">
                  {discussions.map((d) => (
                    <li className="list-item" key={d.id}>
                      <DiscussionItem discussion={d} />
                    </li>
                  ))}
                </ul>
                <Link
                  className="link link:hover"
                  href={`/search/discussions?q=${query}`}
                >
                  view more discussions..
                </Link>
              </div>
            ) : (
              <p className="text-error">No discussions found</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold">Reviews</h2>
            <p>Reviews matching "{query}"...</p>
            {reviews.length > 0 ? (
              <div>
                <ul className="my-4 list space-y-5">
                  {reviews.map((r) => (
                    <li className="list-item" key={r.id}>
                      <ReviewItem review={r} />
                    </li>
                  ))}
                </ul>
                <Link
                  className="link link:hover"
                  href={`/search/reviews?q=${query}`}
                >
                  view more reviews..
                </Link>
              </div>
            ) : (
              <p className="text-error">No reviews found</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold">Lists</h2>
            <p>Lists matching "{query}"...</p>
            {lists.length > 0 ? (
              <div>
                <div className=" my-4 grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  {lists.map((l) => (
                    <ListItem key={l.id} list={l} />
                  ))}
                </div>
                <Link
                  className="link link:hover"
                  href={`/search/lists?q=${query}`}
                >
                  view more lists..
                </Link>
              </div>
            ) : (
              <p className="text-error">No lists found</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold">Tags</h2>
            <p>Tags matching "{query}"...</p>
            {tags.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {tags.map((t) => (
                    <TagItem key={t.id} tag={t} />
                  ))}
                </div>
                <Link
                  className="link link:hover"
                  href={`/search/tags?q=${query}`}
                >
                  view more tags..
                </Link>
              </div>
            ) : (
              <p className="text-error">No tags found</p>
            )}
          </section>
        </div>
      </main>
    );
  }

  // Default welcome content when no query
  return (
    <main>
      <div className="flex flex-col space-y-12 pt-4 p-4 items-center w-full">
        <div>
          <Quote
            content="It's dangerous to go alone! Take this."
            origin="The Legend of Zelda"
          />
        </div>
        <div className="bg-base-300 p-4">
          <p>Search for games, tags, players, discussions, reviews and lists</p>
          <span>Ex. </span>
          <ul className="inline-flex">
            <li>
              <a className="link link-hover" href="">
                popular link
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Page;
