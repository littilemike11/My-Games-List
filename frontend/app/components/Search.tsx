"use client";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// const categories = [
//   { label: "All", value: "all" },
//   { label: "Games", value: "games" },
//   { label: "Players", value: "players" },
//   { label: "Tags", value: "tags" },
//   { label: "Discussions", value: "discussions" },
//   { label: "Lists", value: "lists" },
//   { label: "Reviews", value: "reviews" },
// ];
const categories = [
  "all",
  "games",
  "players",
  "tags",
  "discussions",
  "lists",
  "reviews",
];
const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  //   const query = searchParams.get("q") || "";

  // Extract current category from pathname
  const currentCategory =
    categories.find((cat) => pathname.includes(`/search/${cat}`)) || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = () => {
    const validSearchInput = searchInput
      ?.trim()
      .toLowerCase()
      .replace(/[\s+/]+/g, "-") // turn spaces, +, / into -
      .replace(/-+/g, "-"); // collapse multiple - into one

    if (validSearchInput.trim() === "") return;
    const basePath =
      currentCategory === "all" ? "/search" : `/search/${currentCategory}`;
    router.push(
      basePath + "?" + createQueryString("q", validSearchInput.trim())
    );
  };

  const handleFilterChange = (newCategory: string) => {
    // if (searchInput.trim() === "") return;
    const basePath =
      newCategory === "all" ? "/search" : `/search/${newCategory}`;
    router.push(basePath + "?" + createQueryString("q", searchInput));
  };

  return (
    <div>
      <div className="join w-full flex justify-center border-b-2 pb-2 border-base-300">
        <div>
          <label className="input join-item w-full sm:w-96">
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
            <input
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleSearch())
              }
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="search"
              placeholder="Search"
            />
          </label>
        </div>

        <select
          value={currentCategory}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="select w-fit join-item"
        >
          <option value="all">All</option>
          <option value="games">Games</option>
          <option value="players">Players</option>
          <option value="tags">Tags</option>
          <option value="discussions">Discussions</option>
          <option value="lists">Lists</option>
          <option value="reviews">Reviews</option>
        </select>

        <button onClick={handleSearch} className="btn btn-primary join-item">
          Search
        </button>
      </div>
      {/* <div className="overflow-x-auto border-b-2 px-4 border-base-300 w-screen sm:w-full">
        <div className="flex gap-3  mb-4 ">
          {categories.map(({ label, value }) => {
            const basePath = value === "all" ? "/search" : `/search/${value}`;
            const isActive = currentCategory === value;

            return (
              <Link
                key={value}
                href={`${basePath}?q=${encodeURIComponent(query)}`}
                className={`pb-2 px-2 ${
                  isActive
                    ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};

export default Search;
