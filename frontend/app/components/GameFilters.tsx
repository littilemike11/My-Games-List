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
const GameFilters = () => {
  let activeFilter = "";
  const FILTERS = [
    { name: "Platform", slug: "platform" },
    { name: "Year", slug: "year" },
    // { name: "Games", slug: "games" },
    { name: "Genre", slug: "genre" },
    { name: "Theme", slug: "theme" },
    { name: "Rating", slug: "rating" },
    { name: "Company", slug: "company" },
    { name: "Popularity", slug: "popularit" },
  ];

  const start = 1972;
  const end = new Date().getFullYear() + 2;

  const YEARS = [
    ...Array.from({ length: end - start + 1 }, (_, i) => end - i),
    1958,
  ];

  return (
    <>
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
          {platforms.map((p) => (
            <div
              key={p.id}
              className="btn btn-outline my-1 mx-2 !focus:text-primary"
            >
              {p.name}
            </div>
          ))}
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
              <div key={yr} className="btn btn-outline focus:text-primary">
                {yr}
              </div>
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
            <div
              key={g}
              className="btn btn-outline my-1 mx-2 focus:text-primary"
            >
              {g}
            </div>
          ))}
          <p className="text-2xl">Themes</p>
          {themeNames.map((t) => (
            <div
              key={t}
              className="btn btn-outline my-1 mx-2 focus:text-primary"
            >
              {t}
            </div>
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
          <input type="number" name="" id="" />
          <input type="number" name="" id="" />

          <input type="range" name="" id="" />
        </div>
      </div>
    </>
  );
};

export default GameFilters;
