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

  const filteredPlatforms = parsed.platform || [];
  console.log(filteredPlatforms);
  const filteredGenres = parsed.genre || [];
  console.log(filteredGenres);
  const filteredThemes = parsed.theme || [];
  console.log(filteredThemes);
  const filteredYears = parsed.year || [];
  console.log(filteredYears);
  const filteredRating = parsed.rating || [];
  const filteredHypes = parsed.hype || [];

  type Filters = {
    platform?: string[];
    year?: string[];
    genre?: string[];
    theme?: string[];
    rating?: string[];
    hype?: string[];
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
  if (filteredYears)
    filteredYears.map((yr) => filters.push({ filterType: "year", name: yr }));
  if (filteredThemes)
    filteredThemes.map((t) => filters.push({ filterType: "theme", name: t }));
  if (filteredRating)
    filteredRating.map((r) => filters.push({ filterType: "rating", name: r }));
  if (filteredHypes)
    filteredHypes.map((p) => filters.push({ filterType: "hype", name: p }));
  console.log(filters);

  const start = 1972;
  const end = new Date().getFullYear() + 2;

  const YEARS = [
    ...Array.from({ length: end - start + 1 }, (_, i) => end - i),
    1958,
  ];

  const removeFilterOfType = (type: keyof Filters) => {
    router.push(buildURL({ [type]: [] }));
  };

  const clearAllFilters = () => {
    router.push("/games/");
  };

  function toggleFilter(value: string, type: keyof Filters) {
    const current =
      {
        platform: filteredPlatforms,
        year: filteredYears,
        genre: filteredGenres,
        theme: filteredThemes,
        rating: filteredRating,
        hype: filteredHypes,
      }[type] || [];

    let next;
    if (type == "rating" || type == "hype") {
      next = current.includes(value) ? [] : (next = [value]);
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
      genre: updated.genre ?? filteredGenres,
      theme: updated.theme ?? filteredThemes,
      rating: updated.rating ?? filteredRating,
      hype: updated.hype ?? filteredHypes,
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

    if (next.rating?.length) {
      pathParts.push(`rating/${next.rating}`);
    }

    if (next.hype?.length) {
      pathParts.push(`hype/${next.hype}`);
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
            <form
              onReset={() => removeFilterOfType("year")}
              className="grid grid-cols-10 gap-2"
            >
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
              <input
                onChange={(e) => toggleFilter(e.target.value, "rating")}
                type="range"
                min={0}
                max="100"
                defaultValue="0"
                className="range range-secondary"
              />
              <input
                type="number"
                className="input validator"
                placeholder="Type a number between 1 to 100"
                min="0"
                max="100"
                title="Must be between be 1 to 100"
                onChange={(e) => toggleFilter(e.target.value, "rating")}
              />
              <p className="validator-hint">Min Rating</p>

              <input
                onClick={() => removeFilterOfType("rating")}
                className="btn btn-square btn-error"
                type="reset"
                value="×"
              />
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
                onChange={(e) => toggleFilter(e.target.value, "hype")}
                type="number"
                className="input validator"
                placeholder="choose # of hypes"
                min="0"
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
    </>
  );
};

export default GameFilters;
