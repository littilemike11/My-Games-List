"use client";
import Link from "next/link";
import {
  getPlayerByName,
  getPlayerStats,
} from "@/app/api/supabase-api/profile-api";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "@/app/auth/auth-context";
import FollowButton from "@/app/components/FollowButton";
import { useEffect, useState } from "react";
import { Profile } from "@/app/types/models";
import { getLevel, getLevelProgress } from "@/app/utils/functions";
import { notFound } from "next/navigation";
import Custom404 from "@/app/components/Custom404";
const profileTabs = [
  { key: "games", label: "Games" },
  { key: "reviews", label: "Reviews" },
  { key: "discussions", label: "Discussions" },
  { key: "lists", label: "Lists" },
  { key: "followers", label: "Followers" },
  { key: "following", label: "Following" },
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
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const user = await getPlayerByName(name);
      if (!user) {
        setLoading(false);
        return;
      }
      setUserProfile(user);

      const stats = await getPlayerStats(user.id);
      console.log(stats);
      setFollowerCount(stats?.follower_count);
      setFollowingCount(stats?.following_count);
    } catch (error) {
      console.error("error getting user:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const isOwnProfile =
    session &&
    profile?.username.toLocaleLowerCase() == name.toLocaleLowerCase();

  if (loading) {
    return (
      <>
        <div className="flex w-96 flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div className="skeleton h-48 w-full"></div>
        </div>
      </>
    );
  } else if (userProfile && !loading) {
    return (
      <div className=" px-4 py-12 space-y-6">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center-safe gap-4">
            {userProfile && (
              <figure className="flex flex-col items-center">
                <div
                  className="radial-progress text-accent"
                  style={
                    {
                      "--value": getLevelProgress(userProfile.total_xp), // % toward next level
                      "--size": "7rem",
                      "--thickness": "8px",
                    } as React.CSSProperties
                  }
                >
                  <div className="avatar avatar-placeholder">
                    <span className="badge badge-primary absolute right-0">
                      Lvl {getLevel(userProfile.total_xp)}
                    </span>
                    <div className="bg-neutral text-neutral-content w-24 rounded-full">
                      <span className="text-3xl">{name[0].toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <figcaption className="text-sm opacity-70">
                  XP: {userProfile.total_xp}
                </figcaption>
              </figure>
            )}

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold capitalize">
                {name}
              </h1>
              {/* <p className="text-sm text-base-content/70">{profile?.bio}</p> */}
            </div>
            <div>
              {isOwnProfile ? (
                <Link
                  href={"/profile"}
                  className="btn btn-outline btn-sm min-h-fit"
                >
                  ✏️ <span className="hidden sm:block">Edit Profile</span>
                </Link>
              ) : (
                userProfile && <FollowButton playerID={userProfile.id} />
              )}
            </div>
          </div>
          <div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-value">{followerCount}</div>
                <div className="stat-title">Followers</div>
              </div>

              <div className="stat">
                <div className="stat-value">{followingCount}</div>
                <div className="stat-title">Following</div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-base-content/70">{userProfile?.bio}</p>

        {/* Top-level tabs */}
        <nav className="flex overflow-x-auto max-w-full gap-6 border-b border-base-300">
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
  } else {
    return (
      <>
        <Custom404 title="404 | Player not Found" />;
      </>
    );
  }
}
