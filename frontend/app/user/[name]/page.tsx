"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPlayerByName } from "@/app/api/supabase-api/profile-api";
import { List, ListType, Profile, UserGameList } from "@/app/types/models";
import { useAuth } from "@/app/auth/auth-context";
import {
  getListsByUser,
  getUserGameLists,
} from "@/app/api/supabase-api/list-api";

export default function UserPage() {
  const { name } = useParams<{ name: string }>(); // dynamic route param
  const { session, profile } = useAuth();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [lists, setLists] = useState<List[] | null>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [games, setGames] = useState<UserGameList[]>([]);
  const [listCounts, setListCounts] = useState<Record<string, number>>({});

  const isOwnProfile =
    profile && profile.username.toLowerCase() === name?.toLowerCase();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (name) {
          const response = await getPlayerByName(name);
          setCurrentUser(response);
          console.log(response);
          const response2 = await getUserGameLists(undefined, name);
          console.log(response2);
          setGames(response2);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [name]);

  if (!currentUser) return <p>Loading...</p>;

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* username */}
        <section>
          <div>
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                    </div>
                  </div>
                  <h1 className="text-4xl">{currentUser.username}</h1>
                  {isOwnProfile && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-sm"
                    >
                      edit profile
                    </button>
                  )}
                </div>
                <div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-value">
                        {/* {currentUser.followers?.length || 0} */} 0
                      </div>
                      <div>followers</div>
                    </div>

                    <div className="stat">
                      <div className="stat-value">
                        {/* {currentUser.following.length} */} 0
                      </div>
                      <div>following</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p>{currentUser.bio}</p>
            </div>
          </div>
        </section>

        {/* games */}
        <section>
          <h2>Games</h2>
          <div className="divider"></div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-value">
                {/* {currentUser.played.games.length} */}
              </div>
              <div>✅ played</div>
            </div>

            <div className="stat">
              <div className="stat-value">
                {/* {currentUser.playing.games.length} */}
              </div>
              <div>🎮playing</div>
            </div>
            <div className="stat">
              <div className="stat-value">{listCounts["favorites"]}</div>
              <div>❤️favorites</div>
            </div>
          </div>
        </section>
        {/* stats */}

        <section>
          <h2>Activity</h2>
          <div className="divider"></div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-value">
                {/* {currentUser.reviews.length || 0} */}
              </div>
              <div>⭐reviews</div>
            </div>

            <div className="stat">
              <div className="stat-value">
                {/* {currentUser.discussions.length || 0} */}
              </div>
              <div>💬discussions</div>
            </div>
          </div>
        </section>

        <section>
          <div>
            <h2>Lists</h2>
            <div className="divider"></div>
            <div className="stats shadow">
              {" "}
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-value"></div>
                  <div>📜custom </div>
                </div>

                <div className="stat">
                  <div className="stat-value">{listCounts["wishlist"]}</div>
                  <div>💭wishlist</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
