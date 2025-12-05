"use client";

import Link from "next/link";
import AuthModal from "@/app/components/AuthModal";
import { useAuth } from "../auth/auth-context";
import { useState } from "react";
import supabase from "@/app/utils/supabase/client";
import { FaPlus } from "react-icons/fa";

import Search from "./Search";
import { redirect } from "next/navigation";
// import { getLevel } from "../utils/functions";
const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { session, profile, loading } = useAuth();
  const logout = () => {
    supabase.auth.signOut();
    redirect("/popular");
  };

  return (
    <>
      <div className="navbar items-baseline bg-base-300 fixed z-50 shadow-sm h-16 ">
        <div className="flex-none xl:hidden">
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
          {/* Primary button for the first status (wishlist in this example) */}
          <Link href={"/"} className="btn btn-ghost text-xl join-item">
            The Save Room
          </Link>
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
        <div className="navbar-center hidden lg:block xl:ml-64">
          <Search />
          {/* <ul className="menu menu-horizontal px-1">
            
            <li>
              <Link className="text-xs" href={"/search"}>
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <span className="hidden xl:flex">Search</span>
              </Link>
            </li>
            <li>
              <Link className="text-xs" href={"/games"}>
                🎮 <span className="hidden xl:flex">Games</span>
              </Link>
            </li>
            <li>
              <Link className="text-xs" href={"/reviews"}>
                ⭐ <span className="hidden xl:flex">Reviews</span>
              </Link>
            </li>
            <li>
              <Link className="text-xs" href={"/discussions"}>
                💬 <span className="hidden xl:flex">Discussions</span>
              </Link>
            </li>
            <li>
              <Link className="text-xs" href={"/lists"}>
                📜 <span className="hidden xl:flex">lists</span>
              </Link>
            </li>
            <li>
              <Link className="text-xs" href={"/players"}>
                👥 <span className="hidden xl:flex">Players</span>
              </Link>
            </li>
            <li>
              <Link className="text-xs" href={"/news"}>
                📰 <span className="hidden xl:flex">News</span>
              </Link>
            </li>
          </ul> */}
        </div>
        <div className="navbar-end gap-2">
          <ul className="menu menu-horizontal items-center sm:gap-2">
            {/* search */}
            <li>
              <Link className="lg:hidden" href={"/search"}>
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <span className="hidden lg:block">Search</span>
              </Link>
            </li>
            {/* create content */}
            {session && (
              <li>
                <div className="dropdown dropdown-end p-0">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-sm"
                  >
                    <FaPlus />
                  </div>
                  <ul
                    tabIndex={-1}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  >
                    <li>
                      <Link href={"/list/new"}>Create List</Link>
                    </li>
                    <li>
                      <Link href={"/discussion/new"}> Start Discussion</Link>
                    </li>
                  </ul>
                </div>
              </li>
            )}

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

            {session ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <figure>
                    <div className="avatar avatar-placeholder">
                      <div className="bg-neutral text-neutral-content w-10 rounded-full">
                        <span>{profile?.username[0].toUpperCase()}</span>
                      </div>
                    </div>
                  </figure>
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
                    <Link href={"/profile"}>Settings</Link>
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
          </ul>
        </div>
      </div>
    </>
  );
};
export default Navbar;
