"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPlayerByName } from "@/app/api/supabase-api/profile-api";
import { getUserGames } from "@/app/api/supabase-api/list-api";
import { UserGameList, StatusKey, GameEntry } from "@/app/types/models";

export default function UserGamesTabs() {
  const { name } = useParams<{ name: string }>();
  const [games, setGames] = useState<GameEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<StatusKey>("playing");

  const sections: { key: StatusKey; label: string; icon: string }[] = [
    { key: "playing", label: "Playing", icon: "🎮" },
    { key: "played", label: "Played", icon: "✅" },
    { key: "favorite", label: "Favorites", icon: "❤️" },
    { key: "wishlist", label: "Wishlist", icon: "💭" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!name) return;
      const user = await getPlayerByName(name);
      console.log(user);
      setCurrentUser(user);
      const userGames = await getUserGames(user.id);
      setGames(userGames);
      console.log(userGames);
    };
    fetchData();
  }, [name]);

  const getGamesByStatus = (status: StatusKey) =>
    games.filter((g) => g[status]);

  if (!currentUser) return <p>Loading...</p>;

  return (
    <main className=" px-2 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{currentUser.username}'s Games</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-base-300 mb-6">
        {sections.map((s) => {
          const count = getGamesByStatus(s.key).length;
          const isActive = s.key === activeTab;
          return (
            <button
              key={s.key}
              onClick={() => setActiveTab(s.key)}
              className={
                "pb-2 font-medium border-b-2 transition-colors cursor-pointer " +
                (isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/70 hover:text-base-content")
              }
            >
              {s.icon} {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {getGamesByStatus(activeTab).length > 0 ? (
          getGamesByStatus(activeTab).map((g) => (
            <Link
              key={g.game.id}
              href={`/game/${g.game.slug}`}
              className="group relative rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={g.game.cover}
                alt={g.game.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-xs text-white text-center truncate px-1 py-0.5">
                {g.game.name}
              </span>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-sm text-base-content/60 italic">
            No games in {activeTab}.
          </p>
        )}
      </div>
    </main>
  );
}
