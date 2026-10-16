"use client";
import { useAuth } from "@/app/auth/auth-context";
import { useEffect, useState } from "react";
import { getFollowedTagIDs } from "@/app/api/supabase-api/tag-api";
import {
  getFollowing,
  getFollowingIDs,
} from "@/app/api/supabase-api/profile-api";
import {
  getPostsByTags,
  getPostsByUserIds,
} from "@/app/api/supabase-api/post-api";
import Link from "next/link";
import { Game, GameEntry, GamePreview } from "@/app/types/models";
import PostList from "./components/PostList";
import { getUserGames } from "./api/supabase-api/list-api";
import getGames from "./api/igdb-api-client";
import Carousel from "./components/Carousel";
import GameHero from "./components/GameHero";
import { parseGame } from "./utils/functions";
import Quote from "./components/Quote";
export default function Feed() {
  const { session, profile } = useAuth();
  const [postsByTags, setPostsByTags] = useState<any[]>([]);
  const [postsByFollowers, setPostsByFollowers] = useState<any[]>([]);
  const [games, setGames] = useState<GameEntry[]>([]);

  const [recommendedGames, setRecommendedGames] = useState<GamePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const userID = session?.user.id;
  const [featuredGame, setFeaturedGame] = useState<Game>();
  // let featuredGame;

  useEffect(() => {
    const fetchUserPref = async () => {
      if (userID) {
        try {
          // get tags
          const favTags = await getFollowedTagIDs(userID);
          console.log("tags", favTags);
          const following = await getFollowingIDs(userID);
          if (favTags.length > 0) {
            const response = await getPostsByTags(favTags);
            setPostsByTags(response);
            console.log(response);
          }
          // get following
          console.log("following:", following);
          if (following.length > 0) {
            const response = await getPostsByUserIds(following);
            setPostsByFollowers(response);
            console.log("user posts", response);
          }
          // get random game
          const userGames = await getUserGames(userID);
          setGames(userGames);
          if (userGames.length > 0) {
            const randomIndex = Math.floor(Math.random() * userGames.length);
            let game = userGames[randomIndex].game;
            console.log(game);
            const query = `fields cover.url, first_release_date, genres.name, name, slug, platforms.name, storyline, summary, themes.name, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, screenshots.url, rating, rating_count, similar_games.name, similar_games.slug, similar_games.cover.url,hypes, franchises.games.name, franchises.games.slug, franchises.games.cover.url, videos.name, videos.video_id , artworks.url; where slug = "${game.slug}";`;
            const response = await getGames(query);
            setFeaturedGame(parseGame(response[0]));
            console.log("featured game ", response[0]);
            // featuredGame.game.artwork=response.artwork.replace("t_thumb", "t_original")
            setRecommendedGames(parseGame(response[0]).similarGames);
            console.log(recommendedGames);
          }

          console.log(userGames);
        } catch (error) {
          console.log("error getting tags", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserPref();
  }, [userID]);
  return (
    <>
      <div className="grid grid-cols-1 gap-2 ">
        {featuredGame?.artwork ? (
          <GameHero
            bgImage={featuredGame.artwork[0]}
            heading={`Welcome ${profile?.username}`}
            subHeading=""
            gameName={featuredGame.name}
            gameSlug={featuredGame.slug}
            isUser={true}
            // CTA={false}
          />
        ) : (
          <h1 className="text-4xl text-pretty text-center font-bold mb-6">
            Welcome{" "}
            <span className="italic capitalize">{profile?.username}</span>
          </h1>
        )}

        {/* {featuredGame && <GamePreviewLink game={featuredGame} />} */}
        <Quote type="welcome" />
        {featuredGame && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              Because you liked{" "}
              <Link
                className="text-secondary hover:link"
                href={`/game/${featuredGame.slug}`}
              >
                {featuredGame.name}
              </Link>
            </h2>
            <Carousel
              games={recommendedGames}
              // title={`Because you liked ${featuredGame.name}`}
            />
          </div>
        )}
        {/* name of each tab group should be unique */}
        <div className="tabs tabs-lift">
          <input
            type="radio"
            name="my_tabs_3"
            className="tab text-2xl sm:text-3xl text-primary hover:text-primary/80 text-pretty font-semibold"
            aria-label="Followed Tags"
            defaultChecked
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {loading ? (
              <div className="flex w-52 flex-col gap-4">
                <div className="skeleton h-40 w-full"></div>
                <div className="skeleton h-40 w-full"></div>
                <div className="skeleton h-40 w-full"></div>
              </div>
            ) : postsByTags.length > 0 ? (
              <PostList posts={postsByTags} />
            ) : (
              <p>
                You aren't following any Tags. Explore some Tags{" "}
                <Link className="link link:hover" href={"/popular/tags"}>
                  Here
                </Link>
              </p>
            )}
          </div>

          <input
            type="radio"
            name="my_tabs_3"
            className="tab text-2xl sm:text-3xl text-primary hover:text-primary/80 text-pretty font-semibold"
            aria-label="Following"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {loading ? (
              <div className="flex w-52 flex-col gap-4">
                <div className="skeleton h-40 w-full"></div>
                <div className="skeleton h-40 w-full"></div>
                <div className="skeleton h-40 w-full"></div>
              </div>
            ) : postsByFollowers.length > 0 ? (
              <PostList posts={postsByFollowers} />
            ) : (
              <p>
                You aren't following any Players. Explore other Players{" "}
                <Link className="link link:hover" href={"/popular/players"}>
                  Here
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* <h2 className="text-2xl sm:text-3xl text-pretty font-semibold">
          Games you may like
        </h2> */}
      </div>
    </>
  );
}
