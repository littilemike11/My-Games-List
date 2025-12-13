"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
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
  "discussions",
  "reviews",
  "lists",
  "tags",
];
const STORAGE_KEY = "recentSearches";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  //   const query = searchParams.get("q") || "";

  // Extract current category from pathname
  const currentCategory =
    categories.find((cat) => pathname.includes(`/search/${cat}`)) || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      console.log(params);
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (term?: string) => {
    const validSearchInput = term ?? searchInput?.trim().toLowerCase();
    // .replace(/[\s+/]+/g, "-") // turn spaces, +, / into -
    // .replace(/-+/g, "-"); // collapse multiple - into one

    if (!validSearchInput) return;
    saveRecentSearch(validSearchInput);
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
  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);
  const saveRecentSearch = (term: string) => {
    let updated = [term, ...recentSearches.filter((t) => t !== term)]; // prevent duplicate searches and have repeat search be at top
    updated = updated.slice(0, 5); // keep last 5
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeSearchTerm = (term: string) => {
    let updated = [...recentSearches.filter((t) => t !== term)];
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };
  return (
    <div>
      <div className="join w-full flex justify-center border-b-2 pb-2 border-base-300">
        <div>
          <label className="input join-item w-full sm:w-96 relative group">
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
            {recentSearches.length > 0 && (
              <div
                className="absolute border  bg-amber-50 left-0 top-12 z-50 w-full rounded shadow 
                  opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible
                  transition-opacity duration-200"
              >
                <ul className="text-gray-700 space-y-2">
                  {recentSearches.map((search) => (
                    <li key={search} className="hover:bg-amber-100">
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            setSearchInput(search);
                            handleSearch(search);
                          }}
                          className="flex w-full h-full p-1 cursor-pointer items-center space-x-2"
                        >
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
                          <span>{search}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSearchTerm(search);
                          }}
                          className="btn btn-xs btn-circle btn-ghost size-4 absolute right-2 "
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          <option value="discussions">Discussions</option>
          <option value="reviews">Reviews</option>
          <option value="lists">Lists</option>
          <option value="tags">Tags</option>
        </select>

        <button
          onClick={() => handleSearch()}
          className="btn btn-primary join-item"
        >
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
