"use client";
import { IGDBgenres } from "../mockData/genreTags";
import { IGDBthemes } from "../mockData/themeTags";
import { platforms } from "../mockData/platforms";
import { useEffect, useState } from "react";
import getGames from "../api/igdb-api";
import { GamePreview } from "../types/models";
export default function PersonalizeSection() {
  type SectionName = "Platforms" | "Genres" | "Themes";
  const [recommendedGames, setRecommendedGames] = useState<GamePreview[]>([]);

  interface Preference {
    name: SectionName;
    options: { id: number; name: string }[];
  }

  const preferences: Preference[] = [
    { name: "Platforms", options: platforms },
    { name: "Genres", options: IGDBgenres },
    { name: "Themes", options: IGDBthemes },
  ];

  const [selectedOptions, setSelectedOptions] = useState<{
    Platforms: string[];
    Genres: string[];
    Themes: string[];
  }>({
    Platforms: [],
    Genres: [],
    Themes: [],
  });
  // ✅ Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("userPreferences");
    if (stored) {
      try {
        setSelectedOptions(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing preferences:", err);
      }
    } else {
      // current empty
      localStorage.setItem("userPreferences", JSON.stringify(selectedOptions));
    }
  }, []);

  const updateGames = async () => {
    try {
      // Base rating condition
      const ratingClause = "rating > 50";

      // Collect filter clauses dynamically
      let filterClauses: string[] = [];

      if (selectedOptions.Platforms?.length > 0) {
        const ids = selectedOptions.Platforms.map(
          (name) => platforms.find((p) => p.name === name)?.id
        ).filter(Boolean) as number[]; // remove undefined
        filterClauses.push(`platforms = (${ids.join(",")})`);
      }

      if (selectedOptions.Genres?.length > 0) {
        const ids = selectedOptions.Genres.map(
          (name) => IGDBgenres.find((p) => p.name === name)?.id
        ).filter(Boolean) as number[]; // remove undefined
        filterClauses.push(`genres = (${ids.join(",")})`);
      }

      if (selectedOptions.Themes?.length > 0) {
        const ids = selectedOptions.Themes.map(
          (name) => IGDBthemes.find((p) => p.name === name)?.id
        ).filter(Boolean) as number[]; // remove undefined
        filterClauses.push(`themes = (${ids.join(",")})`);
      }

      // Combine filter clauses with OR (|)
      const filtersQuery =
        filterClauses.length > 0 ? `(${filterClauses.join(" | ")})` : "";

      // Final where clause: rating AND (filters)
      const whereQuery = filtersQuery
        ? `${ratingClause} & ${filtersQuery}`
        : ratingClause;

      // Build final IGDB query string
      const query = `
      fields id, slug, name, cover.url;
      where ${whereQuery};
      sort rating desc;
      limit 10;
    `;
      console.log(query);
      const response = await getGames(query);
      setRecommendedGames(response);
    } catch (error) {
      console.error("Error getting recommended IGDB games:", error);
    }
  };
  // ✅ Save to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(selectedOptions));
    updateGames();
  }, [selectedOptions]);

  const handleOptionChange = (
    sectionName: "Platforms" | "Genres" | "Themes",
    optionName: string
  ) => {
    setSelectedOptions((prev) => {
      const prevSection = prev[sectionName];
      const isSelected = prevSection.includes(optionName);

      const updated = {
        ...prev,
        [sectionName]: isSelected
          ? prevSection.filter((opt) => opt !== optionName)
          : [...prevSection, optionName],
      };

      return updated;
    });
  };
  return (
    <>
      <ul className="menu bg-base-200 rounded-box">
        <li>
          <details>
            <summary>Personalize</summary>
            <ul>
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
              <li>
                <details open>
                  <summary>Parent</summary>
                  <ul>
                    <li>
                      <a>Submenu 1</a>
                    </li>
                    <li>
                      <a>Submenu 2</a>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </details>
        </li>
      </ul>
      <details className="dropdown dropdown-end">
        <summary className="btn m-1">
          Personalize{" "}
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="sliders"
            //   class="svg-inline--fa fa-sliders fa-lg sc-gcnLPh WlYCS"
            className="h-4 w-4"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            color="#9147ff"
          >
            <path
              fill="currentColor"
              d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
            ></path>
          </svg>
        </summary>
        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li>
            <details>
              <summary>games</summary>
              <ul>
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </details>
    </>
  );
}
