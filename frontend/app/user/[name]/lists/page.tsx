import {
  getListsByUser,
  getUserGameLists,
} from "@/app/api/supabase-api/list-api";
import CreateList from "@/app/components/CreateList";
import ListItem from "@/app/components/ListItem";
import { UserGameList, StatusKey } from "@/app/types/models";
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

      const userLists = users[row.user_id].lists;

      // 1️⃣ Handle system statuses as “lists”
      (["played", "playing", "wishlist", "favorite"] as StatusKey[]).forEach(
        (status) => {
          if (row[status]) {
            if (!userLists[status]) {
              userLists[status] = {
                list_id: status,
                list_title: status.charAt(0).toUpperCase() + status.slice(1),
                list_type: status,
                games: [],
              };
            }
            if (userLists[status].games.length < 5) {
              userLists[status].games.push({
                id: row.game_id,
                slug: row.game_slug,
                name: row.game_name,
                cover: row.game_cover,
              });
            }
          }
        }
      );

      // 2️⃣ Handle custom lists
      if (row.custom_lists[0]) {
        row.custom_lists.forEach((listTitle: string) => {
          if (!userLists[listTitle]) {
            userLists[listTitle] = {
              list_id: listTitle,
              list_title: listTitle,
              list_type: "custom",
              games: [],
            };
          }
          if (userLists[listTitle].games.length < 5) {
            userLists[listTitle].games.push({
              id: row.game_id,
              slug: row.game_slug,
              name: row.game_name,
              cover: row.game_cover,
            });
          }
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
      <h1 className="text-3xl mb-4">Lists</h1>
      <CreateList />
      <div>
        {userLists.map((list, index) => (
          <ListItem key={index} gameList={list} />
        ))}
      </div>
      {/* featured, popular this week, recently liked, crew picks */}
    </>
  );
}
