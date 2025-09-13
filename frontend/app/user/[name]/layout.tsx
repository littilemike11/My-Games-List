"use client";
import Link from "next/link";
import { getPlayerByName } from "@/app/api/supabase-api/profile-api";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "@/app/auth/auth-context";
import FollowButton from "@/app/components/FollowButton";
import { useEffect, useState } from "react";
import { Profile } from "@/app/types/models";

const profileTabs = [
  { key: "games", label: "Games" },
  { key: "reviews", label: "Reviews" },
  { key: "discussions", label: "Discussions" },
  { key: "lists", label: "Lists" },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { name } = useParams<{ name: string }>();
  const pathname = usePathname();
  const { session, profile } = useAuth();
  const [userProfile, setUserProfile] = useState<Profile>();

  const fetchUser = async () => {
    try {
      const user = await getPlayerByName(name);
      console.log(user);
      setUserProfile(user);
    } catch (error) {
      console.error("error getting user:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const isOwnProfile =
    session &&
    profile?.username.toLocaleLowerCase() == name.toLocaleLowerCase();
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-28 rounded-full ring ring-primary ring-offset-2">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-sm text-base-content/70">User bio goes here.</p>
          </div>
          {isOwnProfile ? (
            <button className="btn btn-outline btn-sm">✏️ Edit Profile</button>
          ) : (
            userProfile && <FollowButton playerID={userProfile.id} />
          )}
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-value">0</div>
            <div className="stat-title">Followers</div>
          </div>

          <div className="stat">
            <div className="stat-value">0</div>
            <div className="stat-title">Following</div>
          </div>
        </div>
      </div>

      {/* Top-level tabs */}
      <nav className="flex gap-6 border-b border-base-300">
        {profileTabs.map((tab) => {
          const isActive =
            (tab.key === "games" && pathname === `/user/${name}`) ||
            pathname.startsWith(`/user/${name}/${tab.key}`);

          return (
            <Link
              key={tab.key}
              href={
                tab.key === "games"
                  ? `/user/${name}`
                  : `/user/${name}/${tab.key}`
              }
              className={
                "pb-2 font-medium border-b-2 transition-colors " +
                (isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/70 hover:text-base-content")
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Page content */}
      <div>{children}</div>
    </div>
  );
}
