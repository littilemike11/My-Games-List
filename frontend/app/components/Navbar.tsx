"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { FaPlus } from "react-icons/fa";

import AuthModal from "@/app/components/AuthModal";
import { useAuth } from "../auth/auth-context";
import supabase from "@/app/utils/supabase/client";
import Search from "./Search";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { session, profile, loading } = useAuth();
  const router = useRouter();
  const createMenuId = useId();
  const profileMenuId = useId();

  const username = profile?.username;
  const initial = username?.charAt(0).toUpperCase() ?? "?";

  // Allow Escape to close either dropdown.
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape") {
        setShowCreateMenu(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const logout = async () => {
    router.push("/popular");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Unable to sign out:", error.message);
      return;
    }

    setShowProfileMenu(false);

    router.refresh();
  };

  return (
    <>
      <header className="fixed z-50 h-16 w-full shadow-sm">
        <nav
          aria-label="Main navigation"
          className="navbar h-full items-baseline bg-base-300"
        >
          {/* Mobile sidebar trigger */}
          <div className="flex-none xl:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="Open navigation sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          {/* Brand */}
          <div className="navbar-start">
            <Link href="/" className="btn btn-ghost join-item text-xl">
              The Save Room
            </Link>
          </div>

          {/* Desktop search */}
          <div className="navbar-center hidden lg:block xl:ml-64">
            <Search />
          </div>

          <div className="navbar-end gap-2">
            <ul className="menu menu-horizontal items-center sm:gap-2">
              {/* Mobile search */}
              <li className="lg:hidden">
                <Link href="/search" aria-label="Search games and posts">
                  <svg
                    aria-hidden="true"
                    className="h-[1em] opacity-70"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <g
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </g>
                  </svg>
                </Link>
              </li>

              {/* Create content */}
              {session && (
                <li className="relative">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label="Create content"
                    aria-expanded={showCreateMenu}
                    aria-controls={createMenuId}
                    onClick={() => {
                      setShowCreateMenu((open) => !open);
                      setShowProfileMenu(false);
                    }}
                  >
                    <FaPlus aria-hidden="true" />
                  </button>

                  {showCreateMenu && (
                    <ul
                      id={createMenuId}
                      className="menu absolute right-0 top-full z-50 mt-2 w-52 rounded-box bg-base-100 p-2 shadow"
                    >
                      <li>
                        <Link
                          href="/list/new"
                          onClick={() => setShowCreateMenu(false)}
                        >
                          Create list
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/discussion/new"
                          onClick={() => setShowCreateMenu(false)}
                        >
                          Start discussion
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}
            </ul>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

            {/* Authentication actions */}
            {loading ? (
              <span role="status" className="sr-only">
                Loading account
              </span>
            ) : session ? (
              <div className="dropdown dropdown-end relative">
                <button
                  type="button"
                  className="btn btn-ghost btn-circle avatar"
                  aria-label={
                    username ? `Account menu for ${username}` : "Account menu"
                  }
                  aria-expanded={showProfileMenu}
                  aria-controls={profileMenuId}
                  onClick={() => {
                    setShowProfileMenu((open) => !open);
                    setShowCreateMenu(false);
                  }}
                >
                  <span className="avatar avatar-placeholder">
                    <span className="flex w-10 items-center justify-center rounded-full bg-neutral text-neutral-content">
                      {initial}
                    </span>
                  </span>
                </button>

                {showProfileMenu && (
                  <ul
                    id={profileMenuId}
                    className="menu menu-sm absolute right-0 top-full z-50 mt-3 w-56 space-y-2 rounded-box bg-base-100 p-2 shadow"
                  >
                    <li>
                      <span className="pointer-events-none font-semibold">
                        Welcome{username ? `, ${username}` : ""}
                      </span>
                    </li>

                    {username && (
                      <>
                        <li>
                          <Link
                            href={`/user/${encodeURIComponent(username)}`}
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Profile
                          </Link>
                        </li>
                        <li className="pl-4">
                          <Link
                            href={`/user/${encodeURIComponent(username)}/reviews`}
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Reviews
                          </Link>
                        </li>
                        <li className="pl-4">
                          <Link
                            href={`/user/${encodeURIComponent(username)}/discussions`}
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Discussions
                          </Link>
                        </li>
                        <li className="pl-4">
                          <Link
                            href={`/user/${encodeURIComponent(username)}/lists`}
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Lists
                          </Link>
                        </li>
                        <li className="pl-4">
                          <Link
                            href={`/user/${encodeURIComponent(username)}/followers`}
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Followers
                          </Link>
                        </li>
                        <li className="pl-4">
                          <Link
                            href={`/user/${encodeURIComponent(username)}/following`}
                            onClick={() => setShowProfileMenu(false)}
                          >
                            Following
                          </Link>
                        </li>
                      </>
                    )}

                    <li>
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Settings
                      </Link>
                    </li>

                    <li>
                      <button
                        type="button"
                        className="btn btn-error w-full"
                        onClick={logout}
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowAuth(true)}
              >
                Sign in
              </button>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
