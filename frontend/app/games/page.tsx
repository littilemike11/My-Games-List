import Link from "next/link";
import GameFilters from "../components/GameFilters";
import GameSortOptions from "../components/GameSortOptions";
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

const GamesPage = () => {
  let query = "";
  const gameQuery = `
    fields id, name, slug, cover.url;
    search "${query}";
    where version_parent = null;
    limit 10;
  `;
  return (
    <>
      <GameFilters />
      <GameSortOptions />
    </>
  );
};

export default GamesPage;
