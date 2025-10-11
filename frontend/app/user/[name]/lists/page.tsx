import {
  getListsByUser,
  getUserGameLists,
} from "@/app/api/supabase-api/list-api";
import {
  getPlayerByName,
  getPlayerIdByName,
} from "@/app/api/supabase-api/profile-api";
import ListItem from "@/app/components/ListItem";
import { List } from "@/app/types/models";
interface ListsPageProps {
  params: { name: string };
}

export default async function ListsPage({ params }: ListsPageProps) {
  const username = params.name; // 👈 comes from /user/[name]/Lists
  const player = await getPlayerIdByName(username);
  // const lists = await getUserGameLists();
  const lists: List[] = await getListsByUser(player?.id);
  console.log("custom list", lists);

  return (
    <>
      <h1 className="text-3xl mb-4">Lists</h1>
      {/* <CreateList /> */}
      <div>
        {lists.length > 0 ? (
          lists.map((list, index) => <ListItem key={index} list={list} />)
        ) : (
          <p>{username} has not posted any lists yet</p>
        )}
      </div>
      {/* featured, popular this week, recently liked, crew picks */}
    </>
  );
}
