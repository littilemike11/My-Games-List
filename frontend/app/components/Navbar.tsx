"use client";

import Link from "next/link";
import AuthModal from "@/app/components/AuthModal";
import { useAuth } from "../auth/auth-context";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import getGames from "../api/igdb-api";
import supabase from "@/supabase-client";
import { GamePreview } from "../types/models";
const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { session, profile, loading } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<GamePreview[]>([]);
  const [isFocused, setIsFocused] = useState(false); // 👈 controls dropdown

  const logout = () => {
    supabase.auth.signOut();
  };

  const updateSearch = async () => {
    const query = `fields id, name, slug, cover.url ; search"${searchInput}"; limit 10;`;
    const result = await getGames(query);
    console.log(result);
    const formattedResult = result.map((game: any) => ({
      id: game.id,
      slug: game.slug,
      cover: game.cover?.url.replace("t_thumb", "t_cover_big") || null,
      name: game.name,
    }));
    setSearchResults(formattedResult);
  };
  // Search trigger optimization (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchInput.length > 2) updateSearch();
    }, 400); // wait 400ms after typing stops
    return () => clearTimeout(delay);
  }, [searchInput]);

  return (
    <>
      <div className="navbar bg-base-300 fixed z-50 shadow-sm h-16">
        <div className="flex-none lg:hidden">
          <label
            htmlFor="my-drawer-2"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
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
              ></path>
            </svg>
          </label>
        </div>
        <div className="navbar-start">
          {/* <Link href={"/"} className="btn  btn-ghost text-xl">
            The Save Room
          </Link>{" "} */}
          <div className="join">
            {/* Primary button for the first status (wishlist in this example) */}
            <Link href={"/"} className="btn btn-ghost text-xl join-item">
              The Save Room
            </Link>{" "}
            {/* Dropdown for all statuses */}
            <button className="dropdown dropdown-end join-item">
              <div
                // title="Add to other gameStatus"
                tabIndex={0}
                role="button"
                className="btn pl-0 btn-lg btn-ghost rounded-r-full"
              >
                <FaChevronDown />
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box z-10 w-52 p-2 shadow-sm"
              >
                <li>
                  <button className="btn">Home</button>
                </li>
                <li>
                  <button className="btn">Popular</button>
                </li>
                <li>
                  <button className="btn">Latest</button>
                </li>
              </ul>
            </button>
          </div>
          {/* <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost lg:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />{" "}
                  </svg>
                </div>
              </div> */}
        </div>
        <div className="navbar-center hidden lg:flex">
          <div className="w-full lg:w-96 flex justify-end relative group">
            <input
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search"
              className="input input-bordered w-full"
            />

            {/* Dropdown shows only when input is focused */}
            <div
              className="absolute bg-amber-50 top-12 z-50 w-full rounded shadow 
                  opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible
                  transition-opacity duration-200"
            >
              <ul className="text-gray-700">
                {searchInput.length < 3 ? (
                  <li className="p-2 border-b">
                    Please enter 3 or more characters
                  </li>
                ) : searchResults.length > 0 ? (
                  searchResults.map((game) => (
                    <li key={game.id} className="hover:bg-amber-100">
                      <Link href={`/game/${game.slug}`}>
                        <div className="flex items-center gap-2 p-2">
                          {game.cover && (
                            <img
                              className="h-12 w-8 object-cover rounded"
                              src={game.cover}
                              alt={`${game.name} cover`}
                            />
                          )}
                          <p className="font-bold line-clamp-1">{game.name}</p>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-2">No games found</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="navbar-end gap-2">
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

          {session ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm space-y-2 dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <p>Welcome {profile?.username}! </p>
                <li>
                  <Link
                    href={`/user/${profile?.username}`}
                    className="link link-hover"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <button onClick={logout} className="btn">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setShowAuth(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default Navbar;
