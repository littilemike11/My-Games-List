"use client";

import Link from "next/link";
import AuthModal from "@/app/components/AuthModal";
import { useAuth } from "../auth/auth-context";
import { useState } from "react";
import supabase from "@/supabase-client";
const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { session, profile, loading } = useAuth();

  const logout = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href={"/"} className="btn  btn-ghost text-xl">
          My Games List
        </Link>
      </div>
      <div className="flex gap-2">
        <Link href={""} className="link link-hover">
          Contact
        </Link>
        <Link href={"/reviews"} className="link link-hover">
          Reviews
        </Link>
        <Link href={"/discussions"} className="link link-hover">
          Discussions
        </Link>
        <Link href={"/lists"} className="link link-hover">
          Lists
        </Link>
        <Link href={"/player"} className="link link-hover">
          Players
        </Link>
        <Link href={"/articles"} className="link link-hover">
          Articles
        </Link>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />
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
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
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
          <button className="btn btn-primary" onClick={() => setShowAuth(true)}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};
export default Navbar;
