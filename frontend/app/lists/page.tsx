import { getLists, getGamesFromLists } from "../api/supabase-api/list-api";
import ListItem from "../components/ListItem";
import { UserGameList } from "../types/models";
export default async function ListsPage() {
  // const lists = await getLists();
  const lists = await getGamesFromLists();
  console.log(lists);
  // console.log(games);
  const userLists = groupByUser(lists);
  console.log(userLists);
  function groupByUser(data: UserGameList[]) {
    const users: Record<string, any> = {};

    data.forEach((row) => {
      // ensure user bucket
      if (!users[row.user_id]) {
        users[row.user_id] = {
          user_id: row.user_id,
          username: row.username,
          lists: {},
        };
      }

      // ensure list bucket
      if (!users[row.user_id].lists[row.list_id]) {
        users[row.user_id].lists[row.list_id] = {
          list_id: row.list_id,
          list_title: row.list_title,
          list_type: row.list_type,
          list_description: row.list_description,
          list_tags: row.list_tags,
          games: [],
        };
      }

      // push game into the list
      if (users[row.user_id].lists[row.list_id].games.length <= 4) {
        users[row.user_id].lists[row.list_id].games.push({
          id: row.game_id,
          slug: row.game_slug,
          name: row.game_name,
          cover: row.game_cover,
        });
      }
    });

    // convert lists object → array
    return Object.values(users).map((user: any) => ({
      ...user,
      lists: Object.values(user.lists),
    }));
  }

  return (
    <>
      <h1>Lists</h1>
      <div>
        {userLists.map((list, index) => (
          <ListItem key={index} gameList={list} />
        ))}
      </div>
      {/* featured, popular this week, recently liked, crew picks */}
    </>
  );
}
