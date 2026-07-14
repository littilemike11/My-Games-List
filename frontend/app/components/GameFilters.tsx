"use client";
import Link from "next/link";
import { parseFilters } from "../games/[[...filters]]/page";
import { useRouter, useParams } from "next/navigation";
import { platformSlugMap } from "../mockData/platforms";
import { themeSlugMap } from "../mockData/themeTags";
import { genreSlugMap } from "../mockData/genreTags";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";
import { FaSortAlphaDownAlt } from "react-icons/fa";
import { FaSort } from "react-icons/fa";

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
import { platforms } from "../mockData/platforms";
import { IGDBgenres } from "../mockData/genreTags";
import { IGDBthemes } from "../mockData/themeTags";
import { useState, useEffect } from "react";
const GameFilters = () => {
  const router = useRouter();
  const params = useParams();
  console.log("params:", params.filters);

  const segments = params.filters || [];

  const parsed = parseFilters(segments);

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
  const sortOption = parsed.sort || [];
  // let sortOption = parsed.sort?.length ? parsed.sort[0] : "rating_desc";

  // console.log(filteredRating[0]);
  const [minRating, setMinRating] = useState(filteredRating[0]);
  const [minHypes, setMinHypes] = useState(filteredHypes[0]);
  let currentDec = Math.floor(new Date().getFullYear() / 10) * 10;
  let currentYear = new Date().getFullYear();
  let years = [
    ...Array.from(
      { length: currentYear - currentDec + 1 },
      (_, i) => currentYear - i,
    ),
  ];
  type Filters = {
    platform?: string[];
    year?: string[];
    decade?: string[];
    genre?: string[];
    theme?: string[];
    rating?: string[];
    hype?: string[];
    sort?: string[];
  };

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
  const removeFilterOfType = (type: keyof Filters) => {
    router.push(buildURL({ [type]: [] }));
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
        sort: sortOption,
      }[type] || [];

    let next = current;
    console.log(next);
    if (type == "rating" || type == "hype" || type == "sort") {
      next = value != next[0] ? [value] : [];
    } else if (type === "decade") {
      router.push(
        buildURL({
          decade: [value],
          year: [],
        }),
      );
      return;
    } else if (type === "year") {
      router.push(
        buildURL({
          decade: [],
          year: [value],
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
    if (next.sort?.length) {
      pathParts.push(`sort/${next.sort}`);
    }
    return `/games/${pathParts.join("/")}`;
  }

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
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
          </div>
          {/* YEAR */}
          <input
            type="radio"
            name="filters"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Year"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <form onReset={() => removeFilterOfType("year")} className="s">
              <p className="text-2xl">Decades</p>
              <div className="flex">
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
              <p className="text-2xl">Years</p>

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

              <input
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
            <p>up to present day</p>
          </div>
          {/* GENRE/THEMES */}
          <input
            type="radio"
            name="filters"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Genre & Theme"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <p className="text-2xl">Genres</p>
            <form
              onReset={() => removeFilterOfType("genre")}
              className="flex flex-wrap gap-2"
            >
              {IGDBgenres.map((g, index) => (
                <input
                  key={index}
                  onChange={() => toggleFilter(g.slug, "genre")}
                  className="btn btn-outline"
                  checked={filteredGenres.includes(genreSlugMap[g.name])}
                  aria-checked={filteredGenres.includes(genreSlugMap[g.name])}
                  type="checkbox"
                  name="frameworks"
                  aria-label={g.name}
                />
              ))}

              <input
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
            <p className="text-2xl">Themes</p>
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
              onReset={() => removeFilterOfType("rating")}
              className="flex flex-wrap gap-2"
            >
              <div className="flex flex-col gap-4 w-full">
                <input
                  onChange={(e) => setMinRating(e.target.value)}
                  type="range"
                  min={0}
                  max="100"
                  value={minRating ?? 0}
                  className="range range-secondary w-96"
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
                  <input
                    onClick={() => removeFilterOfType("rating")}
                    className="btn btn-square btn-error"
                    type="reset"
                    value="×"
                  />{" "}
                </div>
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
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
          </div>
        </div>
        {/*Active Filters list */}
        <div className="flex flex-wrap gap-2">
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
                    : filter.name}
                <div className="text-red-500">x</div>
              </button>
            ))}
        </div>

        {filters.length > 0 && (
          <div className="flex justify-between">
            <button
              onClick={() => clearAllFilters()}
              className="btn btn-sm btn-ghost"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      {/* SORT OPTIONS */}
      <div className="flex justify-between border-b-2">
        <button
          onClick={
            sortOption[0] == "title_asc"
              ? () => toggleFilter("title_desc", "sort")
              : () => toggleFilter("title_asc", "sort")
          }
          className={`btn btn-md ${
            (sortOption[0] === "title_desc" || sortOption[0] === "title_asc") &&
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
        <div className="flex gap-1">
          <button
            onClick={
              sortOption[0] == "rating_desc"
                ? () => toggleFilter("rating_asc", "sort")
                : () => toggleFilter("rating_desc", "sort")
            }
            className={`btn btn-md ${
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
              sortOption[0] == "hypes_desc"
                ? () => toggleFilter("hypes_asc", "sort")
                : () => toggleFilter("hypes_desc", "sort")
            }
            className={`btn btn-md ${
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
            className={`btn btn-md ${
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
    </>
  );
};

export default GameFilters;
