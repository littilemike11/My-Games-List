// change to catch all /games/[[...filters]]
import Link from "next/link";
import getGames from "@/app/api/igdb-api-server";
import GameFilters from "../../components/GameFilters";
import { platformMap } from "@/app/mockData/platforms";
import { genreMap } from "@/app/mockData/genreTags";
import { themeMap } from "@/app/mockData/themeTags";
import GamePreviewLink from "@/app/components/GamePreviewLink";
import { parseFilters } from "@/app/utils/functions";

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

function getYearTimestamps(year: number) {
  const start = new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000;
  const end = new Date(`${year}-12-31T23:59:59Z`).getTime() / 1000;

  return { start, end };
}
function getDecadeTimestamps(year: number) {
  const start = new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000;
  const end = new Date(`${year + 9}-12-31T23:59:59Z`).getTime() / 1000;

  return { start, end };
}

type SORT_OPTIONS =
  | "rating_desc"
  | "rating_asc"
  | "title_desc"
  | "title_asc"
  | "date_asc"
  | "date_desc"
  | "hypes_asc"
  | "hypes_desc";

const manageSortOptions = (sortOption: SORT_OPTIONS) => {
  let sortQuery = "; sort ";
  switch (sortOption) {
    case "rating_desc":
      sortQuery += "rating desc";
      break;
    case "rating_asc":
      sortQuery += "rating asc";
      break;
    case "title_desc":
      sortQuery += "name desc";
      break;
    case "title_asc":
      sortQuery += "name asc";
      break;
    case "hypes_desc":
      sortQuery += "hypes desc";
      break;
    case "hypes_asc":
      sortQuery += "hypes asc";
      break;
    case "date_desc":
      sortQuery += "first_release_date desc";
      break;
    case "date_asc":
      sortQuery += "first_release_date asc";
      break;
    default:
      sortQuery += "rating desc";
  }
  return sortQuery;
};
type DECADES =
  | "upcoming"
  | "2020s"
  | "2010s"
  | "2000s"
  | "1990s"
  | "1980s"
  | "early";

const manageDecadeOptions = (decade: DECADES) => {
  let dateQuery = "";
  switch (decade) {
    case "early":
      // const earlyDate = Math.floor(new Date("1979-01-01").getTime() / 1000); 283996800
      dateQuery = ` & first_release_date < 283996800`;
      break;
    case "upcoming":
      const today = Math.floor(Date.now() / 1000);
      dateQuery = `& first_release_date > ${today}`;
      break;
    default:
      let formatDecade = Number(decade.slice(0, -1));
      console.log(decade.slice(0, -1));
      const { start, end } = getDecadeTimestamps(formatDecade);
      dateQuery = ` & first_release_date >= ${start} & first_release_date <= ${end}`;
      break;
  }
  return dateQuery;
};

function generateQuery(filters: any): string {
  let query = "";
  const fields =
    "fields cover.url, name, slug, first_release_date, rating, rating_count;";
  let whereClause = `where version_parent=null`;
  let sortClause = "";
  let limitClause = "; limit 50;";

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

    whereClause += ` & first_release_date >= ${start} & first_release_date <= ${end}`;
  }
  // Decade
  if (filters.decade?.length) {
    whereClause += manageDecadeOptions(filters.decade[0]);
    console.log(whereClause);
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
  // rating
  if (filters.rating?.length) {
    console.log(filters.rating);
    whereClause += ` & rating >= ${filters.rating} `;
  }

  // hypes
  if (filters.hype?.length) {
    console.log(filters.hype);
    whereClause += ` & hypes >= ${filters.hype} `;
  }

  if (filters.sort?.length) {
    console.log(filters.sort);
    sortClause = manageSortOptions(filters.sort[0]);
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

  const gameQuery = generateQuery(parsedFilters);
  console.log(gameQuery);
  const games = await getGames(gameQuery);
  console.log(games);
  return (
    <>
      <GameFilters />
      {/* <GameSortOptions /> */}
      {/* <FilteredReults /> */}
      <div className="flex flex-wrap gap-4">
        {games.length > 0 ? (
          games.map((game: any) => (
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
          ))
        ) : (
          <p className="text-error">No Games Found</p>
        )}
      </div>
    </>
  );
}
