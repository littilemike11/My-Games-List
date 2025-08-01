"use client";

import Link from "next/link";
import AuthModal from "@/app/components/AuthModal";
import { useState } from "react";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost text-xl">
          My Games List
        </Link>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />
        <button onClick={() => setShowAuth(true)}>Sign up</button>

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
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
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
