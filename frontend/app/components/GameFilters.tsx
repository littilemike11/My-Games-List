"use client";
import Link from "next/link";
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
import { genreNames } from "../mockData/genreTags";
import { themeNames } from "../mockData/themeTags";
import { useState } from "react";
const GameFilters = () => {
  const [filteredPlatforms, setPlatforms] = useState<string[]>([]);
  const [filteredYears, setYears] = useState<string[]>([]);
  const [filteredGenres, setGenres] = useState<string[]>([]);
  const [filteredThemes, setThemes] = useState<string[]>([]);
  const [filteredMinRating, setMinRatings] = useState(0);
  const [filteredMaxRating, setMaxRatings] = useState(100);
  const [filteredCompanies, setCompanies] = useState<string[]>([]);

  // can initialize to other filters especiall when sent from a previous link with prerequisite filters
  const [filters, setfilters] = useState<string[]>([]);
  let activeFilter = "";
  type FILTERS =
    | "Platform"
    | "Year"
    | "Genre"
    | "Theme"
    | "Rating"
    | "Company"
    | "Popularity";

  /*
  { name: "Platform", slug: "platform" },
    { name: "Year", slug: "year" },
    // { name: "Games", slug: "games" },
    { name: "Genre", slug: "genre" },
    { name: "Theme", slug: "theme" },
    { name: "Rating", slug: "rating" },
    { name: "Company", slug: "company" },
    { name: "Popularity", slug: "popularit" },
  */

  const start = 1972;
  const end = new Date().getFullYear() + 2;

  const YEARS = [
    ...Array.from({ length: end - start + 1 }, (_, i) => end - i),
    1958,
  ];

  const removeFilterOfType = (type: FILTERS) => {
    switch (type) {
      case "Platform":
        setfilters(
          filters.filter((filter) => !filteredPlatforms.includes(filter)),
        );
        setPlatforms([]);

        break;

      default:
        break;
    }
  };
  const removeFilter = (filterName: string) => {
    setfilters(filters.filter((filter) => filter !== filterName));
  };

  const addFilter = (filterName: string, type: FILTERS) => {
    switch (type) {
      case "Platform":
        if (filteredPlatforms.includes(filterName)) {
          setPlatforms(filteredPlatforms.filter((p) => p !== filterName));
          removeFilter(filterName);
        } else {
          setPlatforms([...filteredPlatforms, filterName]);
        }
        break;
      case "Year":
        if (filteredYears.includes(filterName.toString())) {
          removeFilter(filterName);
        } else {
          setYears([...filteredYears, filterName]);
        }
        break;
      case "Genre":
        if (filteredGenres.includes(filterName)) {
          removeFilter(filterName);
        } else {
          setGenres([...filteredGenres, filterName]);
        }
        break;
      case "Theme":
        if (filteredThemes.includes(filterName.toString())) {
          removeFilter(filterName);
        } else {
          setThemes([...filteredThemes, filterName]);
        }
        break;

      default:
        break;
    }
    if (filters.includes(filterName)) {
      removeFilter(filterName);
    } else {
      setfilters([...filters, filterName]);
    }
    console.log(filters);
  };

  const clearAllFilters = () => {
    setfilters([]);
    setPlatforms([]);
    setYears([]);
    setGenres([]);
    setThemes([]);
    setMinRatings(0);
    setMaxRatings(100);
    setCompanies([]);
  };

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
                  onChange={() => addFilter(p.name, "Platform")}
                  className="btn btn-outline"
                  checked={filteredPlatforms.includes(p.name)}
                  aria-checked={filteredPlatforms.includes(p.name)}
                  type="checkbox"
                  name="frameworks"
                  aria-label={p.name}
                />
              ))}

              <input
                onClick={() => removeFilterOfType("Platform")}
                className="btn btn-square"
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
            <div className="grid grid-cols-10 gap-2">
              {YEARS.map((yr) => (
                <button
                  onClick={() => addFilter(yr.toString(), "Year")}
                  key={yr}
                  className="btn btn-outline focus:text-primary"
                >
                  {yr}
                </button>
              ))}
            </div>
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
            {genreNames.map((g) => (
              <button
                onClick={() => addFilter(g, "Genre")}
                key={g}
                className="btn btn-outline my-1 mx-2 focus:text-primary"
              >
                {g}
              </button>
            ))}
            <p className="text-2xl">Themes</p>
            {themeNames.map((t) => (
              <button
                onClick={() => addFilter(t, "Theme")}
                key={t}
                className="btn btn-outline my-1 mx-2 focus:text-primary"
              >
                {t}
              </button>
            ))}
          </div>

          {/* RATING */}
          <input
            type="radio"
            name="my_tabs_3"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Rating"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="flex flex-col justify-center border">
              <input
                type="range"
                min={0}
                max="100"
                defaultValue="40"
                className="range text-blue-300 [--range-bg:orange] [--range-thumb:blue] [--range-fill:0]"
              />
              <div className="w-full max-w-xs">
                <input
                  type="range"
                  min={0}
                  max="100"
                  defaultValue="25"
                  className="range"
                  step="25"
                />
                <div className="flex justify-between px-2.5 mt-2 text-xs">
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                </div>
                <div className="flex justify-between px-2.5 mt-2 text-xs">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
              <div className="flex justify-between">
                <input type="number" name="" id="" />
                <input type="number" name="" id="" />
              </div>
            </div>
          </div>
          {/* COMPANY */}
          <input
            type="radio"
            name="my_tabs_3"
            className="tab active:text-primary/70 focus:text-primary"
            aria-label="Company"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <input type="search" name="" id="" />
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
        <div className="flex flex-wrap gap-2">
          {filters.length > 0 &&
            filters.map((filter, index) => (
              <div key={index} className="badge badge-outline badge-secondary">
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="btn btn-xs btn-circle btn-ghost text-error active:text-black btn-error"
                >
                  x
                </button>
              </div>
            ))}
        </div>
        <div>
          {filters.length > 0 && (
            <button
              onClick={() => clearAllFilters()}
              className="btn btn-sm btn-ghost"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GameFilters;
