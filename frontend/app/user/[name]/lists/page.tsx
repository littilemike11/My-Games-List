import {
  getListsByUser,
  getUserGameLists,
} from "@/app/api/supabase-api/list-api";
import CreateList from "@/app/components/CreateList";
import ListItem from "@/app/components/ListItem";
import { UserGameList, StatusKey, CustomList } from "@/app/types/models";
interface ListsPageProps {
  params: { name: string };
}

export default async function ListsPage({ params }: ListsPageProps) {
  const username = params.name; // 👈 comes from /user/[name]/Lists
  // const lists = await getLists();
  const lists = await getUserGameLists();
  const response = await getListsByUser(username);
  console.log("comstum list", response);
  console.log(lists);
  const custom_lists = mapGames(response);
  console.log(custom_lists);

  function mapGames(data: CustomList[]) {
    const userMap: Record<string, any> = {};

    data.forEach((row) => {
      if (!userMap[row.username]) {
        userMap[row.username] = {
          username: row.username,
          lists: {},
        };
      }

      const userLists = userMap[row.username].lists;

      if (!userLists[row.list_id]) {
        userLists[row.list_id] = {
          list_id: row.list_id,
          list_title: row.list_title,
          comment_count: row.list_comment_count,
          tag: row.list_tags,
          description: row.list_description,
          likes: row.list_likes,
          dislikes: row.list_dislikes,
          games: [],
        };
      }

      if (userLists[row.list_id].games.length < 5) {
        userLists[row.list_id].games.push({
          id: row.game_id,
          slug: row.game_slug,
          name: row.game_name,
          cover: row.game_cover,
        });
      }
    });

    // turn lists objects into arrays
    return Object.values(userMap).map((user: any) => ({
      username: user.username,
      lists: Object.values(user.lists),
    }));
  }

  return (
    <>
      <h1 className="text-3xl mb-4">Lists</h1>
      {/* <CreateList /> */}
      <div>
        {custom_lists.length > 0 ? (
          custom_lists.map((list, index) => (
            <ListItem key={index} gameList={list} />
          ))
        ) : (
          <p>{username} has not posted any lists yet</p>
        )}
      </div>
      {/* featured, popular this week, recently liked, crew picks */}
    </>
  );
}
