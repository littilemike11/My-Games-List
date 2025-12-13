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
import { GamePreview } from "@/app/types/models";
import PostList from "./components/PostList";
export default function Feed() {
  const { session, profile } = useAuth();
  const [postsByTags, setPostsByTags] = useState<any[]>([]);
  const [postsByFollowers, setPostsByFollowers] = useState<any[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<GamePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const userID = session?.user.id;

  useEffect(() => {
    const fetchUserPref = async () => {
      if (userID) {
        try {
          const favTags = await getFollowedTagIDs(userID);
          console.log("tags", favTags);
          const following = await getFollowingIDs(userID);
          if (favTags.length > 0) {
            const response = await getPostsByTags(favTags);
            setPostsByTags(response);
            console.log(response);
          }
          console.log("following:", following);
          if (following.length > 0) {
            const response = await getPostsByUserIds(following);
            setPostsByFollowers(response);
            console.log("user posts", response);
          }
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
      <h1 className="text-4xl text-pretty text-center font-bold mb-6">
        Welcome <span className="italic capitalize">{profile?.username}</span>
      </h1>

      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl sm:text-3xl text-pretty font-semibold">
          Posts from your Favorite Tags
        </h2>
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

        <h2 className="text-2xl sm:text-3xl text-pretty font-semibold">
          Posts from your Followers
        </h2>
        <div>
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

        {/* <h2 className="text-2xl sm:text-3xl text-pretty font-semibold">
          Games you may like
        </h2> */}
      </div>
    </>
  );
}
