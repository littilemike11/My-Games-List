"use client";
import { useAuth } from "../auth/auth-context";
import { useEffect, useState } from "react";
import { getFollowedTagIDs } from "../api/supabase-api/tag-api";
import { getFollowing, getFollowingIDs } from "../api/supabase-api/profile-api";
import {
  getPostsByTags,
  getPostsByUserIds,
} from "../api/supabase-api/post-api";
import DiscussionItem from "../components/DiscussionItem";
import ListItem from "../components/ListItem";
import ReviewItem from "../components/ReviewItem";
import Link from "next/link";
import { ProfileItem } from "../components/ProfileItem";
import { GamePreview } from "../types/models";
export default function Feed() {
  const { session, profile } = useAuth();
  const [postsByTags, setPostsByTags] = useState<any[]>([]);
  const [postsByFollowers, setPostsByFollowers] = useState<any[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<GamePreview[]>([]);

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
            console.log(response);
          }
        } catch (error) {
          console.log("error getting tags", error);
        }
      }
    };
    fetchUserPref();
  }, [userID]);
  return (
    <>
      <h1 className="text-4xl text-pretty text-center font-bold mb-6">
        Welcome <span className="italic">{profile?.username}</span>
      </h1>

      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl sm:text-3xl text-pretty font-semibold">
          Posts from your Favorite Tags
        </h2>
        {postsByTags.length > 0 ? (
          postsByTags.map((post, index) => {
            if (post.parent_type === "review") {
              return (
                <div key={index}>
                  <ReviewItem
                    review={{
                      id: post.parent_id,
                      title: post.title,
                      content: post.content,
                      hours_played: post.hours_played,
                      platform: post.platform,
                      rating: post.rating,
                      created_at: post.created_at,
                      likes: post.likes,
                      dislikes: post.dislikes,
                      comment_count: post.comment_count,
                      game: {
                        cover: post.game_cover,
                        name: post.game_name,
                        id: post.game_id,
                        slug: post.game_slug,
                      },
                      profile: {
                        avatar: post.author_avatar,
                        username: post.author_name,
                        id: post.user_id,
                      },
                      tags: post.tags,
                    }}
                  />
                </div>
              );
            } else if (post.parent_type === "discussion") {
              return (
                <div key={index}>
                  <DiscussionItem
                    discussion={{
                      id: post.parent_id,
                      title: post.title,
                      content: post.content,
                      created_at: post.created_at,
                      likes: post.likes,
                      dislikes: post.dislikes,
                      comment_count: post.comment_count,
                      profile: {
                        avatar: post.author_avatar,
                        username: post.author_name,
                        id: post.user_id,
                      },
                      tags: post.tags,
                    }}
                  />
                </div>
              );
            } else if (post.parent_type === "list") {
              return (
                <div key={index}>
                  <ListItem
                    list={{
                      id: post.parent_id,
                      title: post.title,
                      description: post.content,
                      created_at: post.created_at,
                      likes: post.likes,
                      dislikes: post.dislikes,
                      comment_count: post.comment_count,
                      visibility: post.visibility,
                      profile: {
                        avatar: post.author_avatar,
                        username: post.author_name,
                        id: post.user_id,
                      },
                      games: post.games,
                      tags: post.tags,
                    }}
                  />
                </div>
              );
            }
          })
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
        {postsByFollowers.length > 0 ? (
          postsByFollowers.map((player) => (
            <ProfileItem
              key={player.id}
              profile={player}
              // featureList={userList}
            />
          ))
        ) : (
          <p>
            You aren't following any Players. Explore other Players{" "}
            <Link className="link link:hover" href={"/popular/players"}>
              Here
            </Link>
          </p>
        )}

        <h2 className="text-2xl sm:text-3xl text-pretty font-semibold">
          Games you may like
        </h2>
      </div>
    </>
  );
}
