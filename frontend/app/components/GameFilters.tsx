"use client";
import Link from "next/link";
import { parseFilters } from "../games/[[...filters]]/page";
import { useRouter, usePathname, useParams } from "next/navigation";
import { platformSlugMap } from "../mockData/platforms";
import { themeSlugMap } from "../mockData/themeTags";
import { genreSlugMap } from "../mockData/genreTags";
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
import { useState } from "react";
const GameFilters = () => {
  const router = useRouter();
  const params = useParams();
  console.log("params:", params.filters);

  const segments = params.filters || [];

  const parsed = parseFilters(segments);

  // const [filteredPlatforms, setPlatforms] = useState<string[]>(
  //   parsed.platform || [],
  // );
  // const [filteredYears, setYears] = useState<string[]>(parsed.year || []);
  // const [filteredGenres, setGenres] = useState<string[]>(parsed.genre || []);
  // const [filteredThemes, setThemes] = useState<string[]>(parsed.theme || []);
  // const [filteredMinRating, setMinRatings] = useState(0);
  // const [filteredMaxRating, setMaxRatings] = useState(100);
  // const [filteredCompanies, setCompanies] = useState<string[]>([]);

  // console.log(parsed);

  const filteredPlatforms = parsed.platform || [];
  console.log(filteredPlatforms);
  const filteredGenres = parsed.genre || [];
  console.log(filteredGenres);
  const filteredThemes = parsed.theme || [];
  console.log(filteredThemes);
  const filteredYears = parsed.year || [];
  console.log(filteredYears);

  interface filterType {
    filterType: keyof Filters;
    name: string;
  }
  let filters: filterType[] = [];
  if (filteredPlatforms)
    filteredPlatforms.map((p) =>
      filters.push({ filterType: "platform", name: p }),
    );
  // if (filteredGenres)
  //   if (filteredThemes)
  // filteredGenres.map((g) => filters.push({ filter: "Genre", name: g }));
  // if (filteredYears)
  // filteredThemes.map((t) => filters.push({ filter: "Theme", name: t }));
  // filteredYears.map((yr) => filters.push({ filter: "Year", name: yr }));

  console.log(filters);
  // can initialize to other filters especiall when sent from a previous link with prerequisite filters
  // const [filters, setfilters] = useState<string[]>(
  //   filteredPlatforms
  //     .concat(filteredGenres)
  //     .concat(filteredThemes)
  //     .concat(filteredYears),
  // );
  let activeFilter = "";
  type FILTERS = "Platform" | "Year" | "Genre" | "Theme" | "Rating" | "Hype";

  const start = 1972;
  const end = new Date().getFullYear() + 2;

  const YEARS = [
    ...Array.from({ length: end - start + 1 }, (_, i) => end - i),
    1958,
  ];

  const removeFilterOfType = (type: keyof Filters) => {
    const current =
      {
        platform: filteredPlatforms,
        year: filteredYears,
        genre: filteredGenres,
        theme: filteredThemes,
      }[type] || [];

    if (current.includes(type)) {
      const next = current.filter((f) => f !== type);
      router.push(buildURL({ [type]: next }));
    }
    return;
  };

  const removeFilter = (filter: filterType) => {
    filters.filter((f) => f.name == filter.name);
    // toggleFilter(filter.name, filter.filter);
  };

  // const removeFilter = (filterName: string) => {
  //   setfilters(filters.filter((filter) => filter !== filterName));
  // };

  // const addFilter = (filterName: string, type: FILTERS) => {
  //   const toggle = (
  //     list: string[],
  //     setList: React.Dispatch<React.SetStateAction<string[]>>,
  //   ) => {
  //     if (list.includes(filterName)) {
  //       setList(list.filter((item) => item !== filterName));
  //       setfilters((prev) => prev.filter((f) => f !== filterName));
  //     } else {
  //       setList([...list, filterName]);
  //       setfilters((prev) => [...prev, filterName]);
  //     }
  //   };

  //   switch (type) {
  //     case "Platform":
  //       // toggle(filteredPlatforms, setPlatforms);
  //       break;

  //     case "Year":
  //       // toggle(filteredYears, setYears);
  //       break;

  //     case "Genre":
  //       // toggle(filteredGenres, setGenres);
  //       break;

  //     case "Theme":
  //       // toggle(filteredThemes, setThemes);
  //       break;

  //     case "Company":
  //       // toggle(filteredCompanies, setCompanies);
  //       break;

  //     default:
  //       break;
  //   }
  // };

  const applyFilters = () => {};

  const clearAllFilters = () => {
    // setfilters([]);
    // setPlatforms([]);
    // setYears([]);
    // setGenres([]);
    // setThemes([]);
    // setMinRatings(0);
    // setMaxRatings(100);
    // setCompanies([]);
  };
  type Filters = {
    platform?: string[];
    year?: string[];
    genre?: string[];
    theme?: string[];
  };
  function toggleFilter(value: string, type: keyof Filters) {
    const current =
      {
        platform: filteredPlatforms,
        year: filteredYears,
        genre: filteredGenres,
        theme: filteredThemes,
      }[type] || [];

    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    router.push(buildURL({ [type]: next }));
  }

  function buildURL(updated: any) {
    const next = {
      platform: updated.platform ?? filteredPlatforms,
      year: updated.year ?? filteredYears,
      genre: updated.genre ?? filteredGenres,
      theme: updated.theme ?? filteredThemes,
    };

    const pathParts: string[] = [];
    console.log(next);
    if (next.platform?.length) {
      pathParts.push(`platform/${next.platform.join("+")}`);
    }

    if (next.year?.length) {
      pathParts.push(`year/${next.year.join("+")}`);
    }

    if (next.genre?.length) {
      pathParts.push(`genre/${next.genre.join("+")}`);
    }

    if (next.theme?.length) {
      pathParts.push(`theme/${next.theme.join("+")}`);
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
            name="my_tabs_3"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Platform"
            defaultChecked
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <form className="flex flex-wrap gap-2">
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
                onClick={() => removeFilterOfType("platform")}
                className="btn btn-square text-error"
                type="reset"
                value="×"
              />
            </form>
          </div>
          {/* YEAR */}
          <input
            type="radio"
            name="my_tabs_3"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Year"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <form className="grid grid-cols-10 gap-2">
              {YEARS.map((yr) => (
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
                onClick={() => removeFilterOfType("year")}
                className="btn btn-square"
                type="reset"
                value="×"
              />
            </form>
            <p>up to present day</p>
          </div>
          {/* GENRE/THEMES */}
          <input
            type="radio"
            name="my_tabs_3"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Genre & Theme"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <p className="text-2xl">Genres</p>
            <form className="flex flex-wrap gap-2">
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
                onClick={() => removeFilterOfType("genre")}
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
            </form>
            <p className="text-2xl">Themes</p>
            <form className="flex flex-wrap gap-2">
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
                className="btn btn-square"
                type="reset"
                value="×"
              />
            </form>
          </div>

          {/* RATING */}
          <input
            type="radio"
            name="my_tabs_3"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Rating"
          />

          {/* COMPANY */}
          <input
            type="radio"
            name="my_tabs_3"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Company"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <label className="input">
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
              <input type="search" required placeholder="Search" />
            </label>{" "}
          </div>
          {/* Popularity */}
          <input
            type="radio"
            name="my_tabs_3"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Popularity"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <input type="search" name="" id="" />
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
                {filter.name}
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
            <button
              onClick={() => applyFilters()}
              className="btn btn-primary border-2 border-black"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GameFilters;
