"use client";
import Link from "next/link";
import { convertDate, parseFilters } from "../../utils/functions";
import { useRouter, useParams, usePathname } from "next/navigation";
import { platformSlugMap } from "../../mockData/platforms";
import { themeSlugMap } from "../../mockData/themeTags";
import { genreSlugMap } from "../../mockData/genreTags";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";
import { FaSortAlphaDownAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";

import { FaTrash } from "react-icons/fa";

import { FaSort } from "react-icons/fa";
import { Filters, Game } from "../../types/models";

/*  FILTERS
    - Platform: can toggle / include multiple
        - potentially switch to a steam api for pc
    - year
        - can toggle option to include years up to current or just that year
    - Genre : checkbox
    - Themes : checkbox
    - Rating
    - Companies
    - Popularity / rating count

    SORTING
    Rating
    Title
    Release date
    rating count
*/
import { platforms } from "../../mockData/platforms";
import { IGDBgenres } from "../../mockData/genreTags";
import { IGDBthemes } from "../../mockData/themeTags";
import { useState, useEffect } from "react";
import GamePreviewLink from "../../components/GamePreviewLink";
const GameFilterResults: React.FC<{
  games: Game[];
}> = ({ games }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  console.log("params:", params.filters);

  const segments = params.filters || [];

  const parsed = parseFilters(segments);
  const STORAGE_KEY = "favoriteFilters";

  const filteredPlatforms = parsed.platform || [];
  console.log(filteredPlatforms);
  const filteredGenres = parsed.genre || [];
  console.log(filteredGenres);
  const filteredThemes = parsed.theme || [];
  console.log(filteredThemes);
  const filteredYears = parsed.year || [];
  console.log(filteredYears);
  const filteredDecade = parsed.decade || [];

  const filteredRating = parsed.rating || [];
  const filteredHypes = parsed.hype || [];
  const filteredRatingCount = parsed.rating_count || [];
  const sortOption = parsed.sort || [];
  // let sortOption = parsed.sort?.length ? parsed.sort[0] : "rating_desc";

  // console.log(filteredRating[0]);
  const [minRating, setMinRating] = useState(filteredRating[0]);
  const [minHypes, setMinHypes] = useState(filteredHypes[0]);
  const [minRatingCount, setMinRatingCount] = useState(filteredRatingCount[0]);

  const [isGridLayout, setIsGridLayout] = useState(true);

  const [favoriteFilters, setFavoriteFilters] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Error parsing preferences:", err);
      return [];
    }
  });

  let currentDec = Math.floor(new Date().getFullYear() / 10) * 10;
  let currentYear = new Date().getFullYear();
  let years = [
    ...Array.from(
      { length: currentYear - currentDec + 1 },
      (_, i) => currentYear - i,
    ),
  ];

  interface filterType {
    filterType: keyof Filters;
    name: string;
  }
  let filters: filterType[] = [];
  if (filteredPlatforms)
    filteredPlatforms.map((p) =>
      filters.push({ filterType: "platform", name: p }),
    );
  if (filteredGenres)
    filteredGenres.map((g) => filters.push({ filterType: "genre", name: g }));
  if (filteredYears[0]) {
    filteredYears.map((yr) => filters.push({ filterType: "year", name: yr }));
    let start = Math.floor(Number(filteredYears[0]) / 10) * 10;
    let end = start + 9;
    years = [...Array.from({ length: end - start + 1 }, (_, i) => end - i)];
  } else {
    // default for when no year selected
  }

  if (filteredDecade[0]) {
    filteredDecade.map((d) => filters.push({ filterType: "decade", name: d }));

    let start = Math.floor(new Date().getFullYear() / 10) * 10;
    let end = start + 9;
    switch (filteredDecade[0]) {
      case "upcoming":
        start = new Date().getFullYear();
        end = start + 3;
        years = [...Array.from({ length: end - start + 1 }, (_, i) => end - i)];
        break;
      case "early":
        start = 1972;
        end = 1979;
        years = [
          ...Array.from({ length: end - start + 1 }, (_, i) => end - i),
          1958,
        ];
        break;
      default:
        start = Number(filteredDecade[0].slice(0, -1));
        console.log(start);
        end = start + 9;
        years = [...Array.from({ length: end - start + 1 }, (_, i) => end - i)];
        break;
    }
  }
  if (filteredThemes)
    filteredThemes.map((t) => filters.push({ filterType: "theme", name: t }));
  if (filteredRating[0])
    filteredRating.map((r) => filters.push({ filterType: "rating", name: r }));
  if (filteredHypes[0])
    filteredHypes.map((p) => filters.push({ filterType: "hype", name: p }));
  if (filteredRatingCount[0])
    filteredRatingCount.map((rc) =>
      filters.push({ filterType: "rating_count", name: rc }),
    );
  if (sortOption[0])
    sortOption.map((s) => filters.push({ filterType: "sort", name: s }));
  console.log(filters);

  // const start = 1972;
  // const current = new Date().getFullYear();
  // const end = new Date().getFullYear() + 3;

  // const YEARS = [...Array.from({ length: end - start + 1 }, (_, i) => end - i)];
  // const EARLYYEARS = [1958, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979];

  const DECADES = [
    "upcoming",
    "2020s",
    "2010s",
    "2000s",
    "1990s",
    "1980s",
    "early",
  ];
  const removeFilterOfType = (...types: (keyof Filters)[]) => {
    const updates = Object.fromEntries(types.map((type) => [type, []]));
    router.push(buildURL(updates));
  };

  const clearAllFilters = () => {
    router.push("/games/");
  };

  useEffect(() => {
    if (!minRating) return;
    if (minRating === filteredRating[0]) return;

    const delay = setTimeout(() => {
      toggleFilter(minRating, "rating");
    }, 500);

    return () => clearTimeout(delay);
  }, [minRating, filteredRating]);

  useEffect(() => {
    if (!minHypes) return;
    if (minHypes === filteredHypes[0]) return;

    const delay = setTimeout(() => {
      toggleFilter(minHypes, "hype");
    }, 500);

    return () => clearTimeout(delay);
  }, [minHypes, filteredHypes]);

  useEffect(() => {
    if (!minRatingCount) return;
    if (minRatingCount === filteredRatingCount[0]) return;

    const delay = setTimeout(() => {
      toggleFilter(minRatingCount, "rating_count");
    }, 500);

    return () => clearTimeout(delay);
  }, [minRatingCount, filteredRatingCount]);

  function toggleFilter(value: string, type: keyof Filters) {
    const current =
      {
        platform: filteredPlatforms,
        year: filteredYears,
        decade: filteredDecade,
        genre: filteredGenres,
        theme: filteredThemes,
        rating: filteredRating,
        hype: filteredHypes,
        rating_count: filteredRatingCount,
        sort: sortOption,
      }[type] || [];

    let next = current;
    console.log(next);
    if (
      type == "rating" ||
      type == "rating_count" ||
      type == "hype" ||
      type == "sort"
    ) {
      next = value != next[0] ? [value] : [];
    } else if (type === "decade") {
      router.push(
        buildURL({
          decade: value != next[0] ? [value] : [],
          year: [],
        }),
      );
      return;
    } else if (type === "year") {
      router.push(
        buildURL({
          decade: [],
          year: value != next[0] ? [value] : [],
        }),
      );
      return;
    } else {
      next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
    }
    router.push(buildURL({ [type]: next }));
  }

  function buildURL(updated: Filters) {
    const next = {
      platform: updated.platform ?? filteredPlatforms,
      year: updated.year ?? filteredYears,
      decade: updated.decade ?? filteredDecade,
      genre: updated.genre ?? filteredGenres,
      theme: updated.theme ?? filteredThemes,
      rating: updated.rating ?? filteredRating,
      hype: updated.hype ?? filteredHypes,
      rating_count: updated.rating_count ?? filteredRatingCount,
      sort: updated.sort ?? sortOption,
    };

    const pathParts: string[] = [];
    console.log(next);
    if (next.platform?.length) {
      pathParts.push(`platform/${next.platform.join("+")}`);
    }
    //  onl one date filter
    if (next.year?.length) {
      pathParts.push(`year/${next.year.join("+")}`);
    } else if (next.decade?.length) {
      pathParts.push(`decade/${next.decade.join("+")}`);
    }

    if (next.genre?.length) {
      pathParts.push(`genre/${next.genre.join("+")}`);
    }

    if (next.theme?.length) {
      pathParts.push(`theme/${next.theme.join("+")}`);
    }

    if (next.rating?.length) {
      pathParts.push(`rating/${next.rating}`);
    }

    if (next.hype?.length) {
      pathParts.push(`hype/${next.hype}`);
    }
    if (next.rating_count?.length) {
      pathParts.push(`rating_count/${next.rating_count}`);
    }
    if (next.sort?.length) {
      pathParts.push(`sort/${next.sort}`);
    }
    return `/games/${pathParts.join("/")}`;
  }

  // Favorites setting/getting
  // ✅ Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavoriteFilters(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing preferences:", err);
      }
    } else {
      // current empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }, []);

  // ✅ Save to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteFilters));
  }, [favoriteFilters]);

  return (
    <>
      <div>
        {/* name of each tab group should be unique */}
        <div className="tabs tabs-lift">
          {/* Platform */}
          <input
            type="radio"
            name="filters"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Platform"
            defaultChecked
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <p className="text-2xl mb-2">Platforms</p>
            <form
              onReset={() => removeFilterOfType("platform")}
              className="flex flex-wrap gap-2"
            >
              {platforms.map((p, index) => (
                <input
                  key={index}
                  onChange={() => toggleFilter(p.slug, "platform")}
                  className="btn btn-outline"
                  checked={filteredPlatforms.includes(platformSlugMap[p.name])}
                  aria-checked={filteredPlatforms.includes(p.name)}
                  type="checkbox"
                  name="frameworks"
                  aria-label={p.name}
                />
              ))}
              <input
                title="Reset Platform Filters"
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
          </div>
          {/* Release */}
          <input
            type="radio"
            name="filters"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Release"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <p className="text-2xl mb-2 ">Decades</p>
            <form
              className="flex flex-col gap-2"
              onReset={() => removeFilterOfType("year", "decade")}
            >
              <div className="flex flex-wrap">
                {DECADES.map((decade) => (
                  <input
                    key={decade}
                    onChange={() => toggleFilter(decade, "decade")}
                    className="btn btn-outline"
                    checked={filteredDecade.includes(decade)}
                    aria-checked={filteredDecade.includes(decade)}
                    type="checkbox"
                    name="frameworks"
                    aria-label={decade}
                  />
                ))}
              </div>
              <p className="text-2xl mb-2 block">Years</p>
              <div className="flex flex-wrap space-y-2">
                {years.map((yr) => (
                  <input
                    key={yr}
                    onChange={() => toggleFilter(yr.toString(), "year")}
                    className="btn btn-outline"
                    checked={filteredYears.includes(yr.toString())}
                    aria-checked={filteredYears.includes(yr.toString())}
                    type="checkbox"
                    name="frameworks"
                    aria-label={yr.toString()}
                  />
                ))}
              </div>

              <input
                title="Reset Date Filters"
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
          </div>
          {/* GENRE/THEMES */}
          <input
            type="radio"
            name="filters"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Genres & Themes"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <p className="text-2xl mb-2">Genres</p>
            <form
              onReset={() => removeFilterOfType("genre")}
              className="flex flex-wrap gap-2"
            >
              {IGDBgenres.map((g, index) => (
                <input
                  key={index}
                  onChange={() => toggleFilter(g.slug, "genre")}
                  className="btn btn-sm sm:btn-md btn-outline"
                  checked={filteredGenres.includes(genreSlugMap[g.name])}
                  aria-checked={filteredGenres.includes(genreSlugMap[g.name])}
                  type="checkbox"
                  name="frameworks"
                  aria-label={g.name}
                />
              ))}

              <input
                title="Reset Genre Filters"
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
            <p className="text-2xl mb-2">Themes</p>
            <form
              onReset={() => removeFilterOfType("theme")}
              className="flex flex-wrap gap-2"
            >
              {IGDBthemes.map((t, index) => (
                <input
                  key={index}
                  onChange={() => toggleFilter(t.slug, "theme")}
                  className="btn btn-outline"
                  checked={filteredThemes.includes(themeSlugMap[t.name])}
                  aria-checked={filteredThemes.includes(themeSlugMap[t.name])}
                  type="checkbox"
                  name="frameworks"
                  aria-label={t.name}
                />
              ))}

              <input
                title="Reset Theme Filters"
                onClick={() => removeFilterOfType("theme")}
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
          </div>

          {/* RATING */}
          <input
            type="radio"
            name="filters"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Rating"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <form
              onReset={() => removeFilterOfType("rating", "rating_count")}
              className="flex flex-wrap gap-2"
            >
              <div className="flex flex-col gap-2 w-full">
                <p className="text-2xl mb-2">Rating</p>
                <input
                  onChange={(e) => setMinRating(e.target.value)}
                  type="range"
                  min={0}
                  max="100"
                  value={minRating ?? 0}
                  className="range range-secondary w-full sm:w-96"
                />
                <div className="flex w-full gap-2">
                  <div className="w-fit">
                    <input
                      type="number"
                      className="input validator w-96 "
                      placeholder="Enter a rating between 0 to 100"
                      min="0"
                      max="100"
                      value={minRating}
                      title="Must be between be 0 to 100"
                      onChange={(e) => setMinRating(e.target.value)}
                    />
                    <p className="validator-hint">
                      Rating must be between 0-100
                    </p>
                  </div>
                </div>
                <p className="text-2xl mb-2">Rating Count</p>
                <input
                  onChange={(e) => setMinRatingCount(e.target.value)}
                  type="number"
                  className="input validator"
                  placeholder="choose # of ratings"
                  min="0"
                  value={minRatingCount}
                />
                <input
                  title="Reset Rating Filters"
                  className="btn btn-square btn-error"
                  type="reset"
                  value="×"
                />{" "}
              </div>
            </form>
          </div>

          {/* Popularity */}
          <input
            type="radio"
            name="filters"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Popularity"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <p className="text-2xl mb-2">Hypes</p>
            <form
              onReset={() => removeFilterOfType("hype")}
              className="flex flex-wrap gap-2"
            >
              <input
                onChange={(e) => setMinHypes(e.target.value)}
                type="number"
                className="input validator"
                placeholder="choose # of hypes"
                min="0"
                value={minHypes}
              />
              <input
                title="Reset Hype Filter"
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
          </div>
          {/* Favorites */}
          <input
            type="radio"
            name="filters"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Saved Filters"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <p className="text-2xl mb-2">Saved Filters</p>

            <ul className="space-y-6 sm:space-y-4">
              {favoriteFilters.length > 0 ? (
                <>
                  {favoriteFilters.map((f) => (
                    <li key={f}>
                      <div className="flex flex-wrap items-center gap-3 group">
                        <Link className="hover:link inline" href={f}>
                          - {f}
                        </Link>

                        <button
                          type="button"
                          aria-label={`Remove ${f} from favorites`}
                          title="Remove favorite"
                          onClick={() => {
                            setFavoriteFilters((favorites) =>
                              favorites.filter((favorite) => favorite !== f),
                            );
                          }}
                          className="
                          inline sm:hidden
                group-hover:inline-flex items-center justify-center
                p-1
                
                rounded
                cursor-pointer
                text-base-content/60
                hover:text-error
                hover:bg-base-200
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-current
                transition-colors
              "
                        >
                          <FaTrash aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}

                  {/* Remove all */}
                  <li className="mt-2">
                    <button
                      type="button"
                      onClick={() => setFavoriteFilters([])}
                      className="
            inline-flex items-center gap-1
            cursor-pointer
            text-sm
            text-base-content/60
            hover:text-error
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-current
            transition-colors
          "
                    >
                      <FaTrash aria-hidden="true" />
                      Remove all
                    </button>
                  </li>
                </>
              ) : (
                <li>No Filters Saved</li>
              )}
            </ul>
          </div>
        </div>
        {/*Active Filters list */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.length > 0 &&
            filters.map((filter, index) => (
              <button
                key={index}
                className="btn btn-secondary btn-sm rounded-4xl"
                onClick={() => toggleFilter(filter.name, filter.filterType)}
              >
                {filter.filterType === "rating"
                  ? `Min Rating: ${filter.name} `
                  : filter.filterType === "hype"
                    ? `Hypes >= ${filter.name} `
                    : filter.filterType === "rating_count"
                      ? `Rating Count >= ${filter.name} `
                      : filter.name}
                <div className="text-red-500">x</div>
              </button>
            ))}
        </div>
        {/* favorite button */}
        {filters.length > 0 && (
          <div className="flex mt-2 px-2 justify-between">
            {favoriteFilters.includes(pathname) ? (
              <button
                title="Remove search from Favorites"
                className="btn btn-circle btn-ghost group"
                onClick={() => {
                  setFavoriteFilters((favorites) =>
                    favorites.filter((f) => f !== pathname),
                  );
                }}
              >
                ❤️
              </button>
            ) : (
              <button
                title="Add search to Favorites"
                className="btn btn-circle btn-ghost group"
                onClick={() => {
                  setFavoriteFilters((favorites) => [...favorites, pathname]);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="red"
                  className="size-[1.2em] group-hover:fill-red-500 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={() => clearAllFilters()}
              className="btn btn-sm btn-error"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      {/* SORT OPTIONS */}
      <div className="flex mt-4 mb-2 pb-1 justify-between border-b-2">
        <div className="flex items-center gap-x-1">
          <div className="flex">
            {isGridLayout ? (
              <button
                type="button"
                aria-label={`Switch to list layout`}
                title="View List Layout"
                onClick={() => setIsGridLayout(false)}
                className="
                p-1
                rounded
                cursor-pointer
                text-base-content
                hover:text-base-content/60
                hover:bg-base-200
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-current
                transition-colors"
              >
                <FaList />
              </button>
            ) : (
              <button
                type="button"
                aria-label={`Switch to Grid layout`}
                title="View Grid Layout"
                onClick={() => setIsGridLayout(true)}
                className="
                p-1
                rounded
                cursor-pointer
                text-base-content
                hover:text-base-content/60
                hover:bg-base-200
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-current
                transition-colors"
              >
                <BsFillGrid3X3GapFill />
              </button>
            )}
          </div>
          <button
            onClick={
              sortOption[0] == "title_asc"
                ? () => toggleFilter("title_desc", "sort")
                : () => toggleFilter("title_asc", "sort")
            }
            className={`btn btn-xs sm:btn-md ${
              (sortOption[0] === "title_desc" ||
                sortOption[0] === "title_asc") &&
              "font-bold text-primary"
            }`}
          >
            Title
            {sortOption[0] === "title_desc" ? (
              <FaSortAlphaDownAlt />
            ) : sortOption[0] === "title_asc" ? (
              <FaSortAlphaDown />
            ) : (
              <FaSort />
            )}
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={
              sortOption[0] == "rating_desc"
                ? () => toggleFilter("rating_asc", "sort")
                : () => toggleFilter("rating_desc", "sort")
            }
            className={`btn btn-xs sm:btn-md ${
              (sortOption[0] === "rating_desc" ||
                sortOption[0] === "rating_asc") &&
              "font-bold text-primary"
            }`}
          >
            Rating
            {sortOption[0] === "rating_desc" ? (
              <FaSortAmountDown />
            ) : sortOption[0] === "rating_asc" ? (
              <FaSortAmountDownAlt />
            ) : (
              <FaSort />
            )}
          </button>
          <button
            onClick={
              sortOption[0] == "rating_count_desc"
                ? () => toggleFilter("rating_count_asc", "sort")
                : () => toggleFilter("rating_count_desc", "sort")
            }
            className={`btn btn-xs sm:btn-md ${
              (sortOption[0] === "rating_count_desc" ||
                sortOption[0] === "rating_count_asc") &&
              "font-bold text-primary"
            }`}
          >
            Rating Count
            {sortOption[0] === "rating_count_desc" ? (
              <FaSortAmountDown />
            ) : sortOption[0] === "rating_count_asc" ? (
              <FaSortAmountDownAlt />
            ) : (
              <FaSort />
            )}
          </button>
          <button
            onClick={
              sortOption[0] == "hypes_desc"
                ? () => toggleFilter("hypes_asc", "sort")
                : () => toggleFilter("hypes_desc", "sort")
            }
            className={`btn btn-xs sm:btn-md ${
              (sortOption[0] === "hypes_desc" ||
                sortOption[0] === "hypes_asc") &&
              "font-bold text-primary"
            }`}
          >
            Hypes
            {sortOption[0] === "hypes_desc" ? (
              <FaSortAmountDown />
            ) : sortOption[0] === "hypes_asc" ? (
              <FaSortAmountDownAlt />
            ) : (
              <FaSort />
            )}
          </button>
          <button
            onClick={
              sortOption[0] == "date_desc"
                ? () => toggleFilter("date_asc", "sort")
                : () => toggleFilter("date_desc", "sort")
            }
            className={`btn btn-xs sm:btn-md ${
              (sortOption[0] === "date_desc" || sortOption[0] === "date_asc") &&
              "font-bold text-primary"
            }`}
          >
            Date
            {sortOption[0] === "date_desc" ? (
              <FaSortAmountDown />
            ) : sortOption[0] === "date_asc" ? (
              <FaSortAmountDownAlt />
            ) : (
              <FaSort />
            )}
          </button>
        </div>
      </div>
      {/* Games Display */}
      <div className="flex flex-wrap justify-around sm:justify-start gap-3 pb-4">
        {/* Grid Layout */}
        {games.length > 0 && isGridLayout ? (
          games.map((game: any) => (
            <div className="w-24 sm:w-36 h-32 sm:h-48 " key={game.id}>
              <GamePreviewLink
                game={{
                  id: game.id,
                  slug: game.slug,
                  cover:
                    game.cover?.url?.replace("t_thumb", "t_cover_big") || null,
                  name: game.name,
                }}
              />
            </div>
          ))
        ) : // List Layout
        games.length > 0 && !isGridLayout ? (
          <div className="flex flex-col gap-4">
            {games.map((game: any) => (
              <div
                key={game.id}
                className="flex w-full gap-4 rounded-lg border border-base-300 bg-base-100 p-3 shadow-sm transition hover:shadow-md sm:gap-6 sm:p-4"
              >
                {/* Cover */}
                <div className=" shrink-0 w-24 sm:w-36 h-32 sm:h-48">
                  <GamePreviewLink
                    game={{
                      id: game.id,
                      slug: game.slug,
                      cover:
                        game.cover?.url?.replace("t_thumb", "t_cover_big") ||
                        null,
                      name: game.name,
                    }}
                  />
                </div>

                {/* Game Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <h3 className="mb-1 text-xl font-bold sm:text-2xl md:text-3xl">
                      {game.name}
                    </h3>

                    <p className="text-sm opacity-70 sm:text-base">
                      {convertDate(game.first_release_date)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:flex sm:flex-wrap sm:gap-x-6 sm:text-base">
                    <p>
                      <span className="font-semibold">Rating:</span>{" "}
                      {game.rating?.toFixed(1) ?? "N/A"}
                    </p>

                    <p>
                      <span className="font-semibold">Rating Count:</span>{" "}
                      {game.rating_count ?? 0}
                    </p>

                    <p>
                      <span className="font-semibold">Hypes:</span>{" "}
                      {game.hypes ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-error">No Games Found</p>
        )}
      </div>
    </>
  );
};

export default GameFilterResults;
