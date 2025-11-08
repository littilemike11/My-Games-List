"use client";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../auth/auth-context";
import { getFollowing } from "../api/supabase-api/profile-api";
import { getFollowedTags } from "../api/supabase-api/tag-api";
import { GamePreview, History, ProfilePreview, Tag } from "../types/models";
import TagItem from "./TagItem";
import { IGDBgenres } from "../mockData/genreTags";
import { IGDBthemes } from "../mockData/themeTags";
import { platforms } from "../mockData/platforms";
import getGames from "../api/igdb-api";
export default function DrawerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useAuth();
  const userID = session?.user.id;
  const [favTags, setFavTags] = useState<Tag[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<GamePreview[]>([]);
  const [following, setFollowing] = useState<ProfilePreview[]>([]);
  const [searches, setSearches] = useState<History[]>([]);
  type SectionName = "Platforms" | "Genres" | "Themes";

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
    // get user pref
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

    // get recent searches
    const recentSearches = localStorage.getItem("searches");
    if (recentSearches) {
      setSearches(JSON.parse(recentSearches));
    } else {
      localStorage.setItem("searches", JSON.stringify(searches));
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
  useEffect(() => {
    const fetchUserPref = async () => {
      if (userID) {
        try {
          const tagResponse = await getFollowedTags(userID);
          setFavTags(tagResponse);
          const followingResponse = await getFollowing(userID);
          setFollowing(followingResponse);
        } catch (error) {
          console.log("error getting tags", error);
        }
      }
    };
    fetchUserPref();
  }, [userID]);
  return (
    <>
      <div className="drawer xl:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content pt-16 ">
          {/* Page content here */}
          {/* <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label> */}
          {children}
        </div>
        {/* drawer side */}
        <div className="drawer-side pt-16 ">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <nav className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">
            <ul className=" bg-base-200 rounded-box text-lg space-y-2 w-full">
              <li>
                <Link href={"/"}>🏠 Home</Link>
              </li>
              <li>
                <Link href={"/popular"}>✨ Popular</Link>
              </li>
              {/* <li>
                <Link href={"/games"}>🎮 Games</Link>
              </li> */}
              <li>
                <Link href={"/popular/reviews"}>⭐ Reviews</Link>
              </li>
              <li>
                <Link href={"/popular/discussions"}>💬 Discussions</Link>
              </li>
              <li>
                <Link href={"/popular/lists"}>📜 lists</Link>
              </li>
              <li>
                <Link href={"/popular/players"}>👥 Players</Link>
              </li>
              <li>
                <Link href={"/news"}>📰 News</Link>
              </li>
              <li>
                <details>
                  <summary>Recently Visited</summary>
                  <ul>
                    {searches.length > 0 &&
                      searches.map((visit: History, index) => (
                        <li key={index}>
                          <Link href={visit.link}>{visit.title}</Link>
                        </li>
                      ))}
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>Tags</summary>
                  <ul>
                    {favTags.length > 0 &&
                      favTags.map((tag) => (
                        <li key={tag.id}>
                          <TagItem tag={tag} />
                        </li>
                      ))}
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>Following</summary>
                  <ul>
                    {following.length > 0 &&
                      following.map((user) => (
                        <li key={user.id}>
                          <div className="flex gap-2 items-center">
                            <figure>
                              <div className="avatar avatar-placeholder">
                                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                                  <span className="text-sm">
                                    {user.username[0].toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </figure>
                            <Link
                              className="italic link link-hover"
                              href={`/user/${user.username}`}
                            >
                              {user.username}
                            </Link>
                          </div>
                        </li>
                      ))}
                  </ul>
                </details>
              </li>
              <li>
                <details open>
                  <summary>Personalize</summary>
                  <ul>
                    {preferences.map((section) => (
                      <li key={section.name}>
                        <details>
                          <summary>{section.name}</summary>
                          <ul className="list-disc list-inside text-sm">
                            {section.options.map((option) => (
                              <li key={option.id}>
                                <label className="label text-wrap">
                                  <input
                                    onChange={() =>
                                      handleOptionChange(
                                        section.name,
                                        option.name
                                      )
                                    }
                                    checked={selectedOptions[
                                      section.name
                                    ].includes(option.name)}
                                    type="checkbox"
                                    className="checkbox"
                                  />
                                  {option.name}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
