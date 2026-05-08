// change to catch all /games/[[...filters]]
import Link from "next/link";
import getGames from "@/app/api/igdb-api-server";
import GameFilters from "../../components/GameFilters";
import GameSortOptions from "../../components/GameSortOptions";
import FilteredReults from "./FilteredResults";
import { platformMap } from "@/app/mockData/platforms";
import { genreMap } from "@/app/mockData/genreTags";
import { themeMap } from "@/app/mockData/themeTags";
import GamePreviewLink from "@/app/components/GamePreviewLink";

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
type Filters = {
  platform?: string[];
  year?: string[];
  genre?: string[];
  theme?: string[];
};

export function parseFilters(segments: string[] | string = []): Filters {
  const filters: Filters = {};

  for (let i = 0; i < segments.length; i += 2) {
    const key = segments[i];
    let value = segments[i + 1];

    if (!value) continue;
    value = decodeURIComponent(value); // see + in uri

    switch (key) {
      case "platform":
        filters.platform = value.split("+");
        break;
      case "year":
        filters.year = value.split("+");
        break;
      case "genre":
        filters.genre = value.split("+");
        break;
      case "theme":
        filters.theme = value.split("+");

        break;
    }
  }

  return filters;
}

function getYearTimestamps(year: number) {
  const start = new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000;
  const end = new Date(`${year}-12-31T23:59:59Z`).getTime() / 1000;

  return { start, end };
}

function generateQuery(filters: any): string {
  let query = "";
  const fields =
    "fields cover.url, name, slug, first_release_date, rating, rating_count;";
  let whereClause = `where version_parent=null`;
  let sortClause = `;sort rating desc`;
  let limitClause = ";limit 50;";

  //  add filters in where clause
  // Platforms
  if (filters.platform?.length) {
    const ids = filters.platform.map((p: string) => platformMap[p]).join(", ");

    if (ids.length) {
      whereClause += ` & platforms = (${ids}) `;
    }
  }
  // Year
  if (filters.year?.length) {
    const { start, end } = getYearTimestamps(Number(filters.year));

    whereClause += `& first_release_date >= ${start} & first_release_date <= ${end}`;
  }
  // Genre
  if (filters.genre?.length) {
    const ids = filters.genre.map((g: string) => genreMap[g]).join(", ");

    if (ids.length) {
      whereClause += ` & genres = (${ids}) `;
    }
  }
  // Theme
  if (filters.theme?.length) {
    const ids = filters.theme.map((t: string) => themeMap[t]).join(", ");

    if (ids.length) {
      whereClause += ` & themes = (${ids}) `;
    }
  }

  query = fields + whereClause + sortClause + limitClause;
  return query;
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ filters?: string[] }>;
}) {
  const { filters } = await params;

  console.log(filters);
  let parsedFilters = parseFilters(filters);

  console.log(parsedFilters);

  //   const gameQuery = `
  //     fields cover.url, name, slug, first_release_date, rating, rating_count;
  // where version_parent=null & platforms={48,6} ;
  // sort rating desc;
  // limit 10;
  //   `;
  const gameQuery = generateQuery(parsedFilters);
  console.log(gameQuery);
  const games = await getGames(gameQuery);
  console.log(games);
  return (
    <>
      <GameFilters />
      <GameSortOptions />
      {/* <FilteredReults /> */}
      <div className="flex flex-wrap gap-4">
        {games.map((game: any) => (
          <div className="h-44" key={game.id}>
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
        ))}
      </div>
    </>
  );
}
