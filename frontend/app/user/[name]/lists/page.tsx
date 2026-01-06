import { getListsByUser } from "@/app/api/supabase-api/list-api";
import { getPlayerIdByName } from "@/app/api/supabase-api/profile-api";
import ListItem from "@/app/components/ListItem";
import { List } from "@/app/types/models";
interface ListsPageProps {
  params: Promise<{ name: string }>;
}

export default async function ListsPage({ params }: ListsPageProps) {
  const { name } = await params;
  const username = name; // 👈 comes from /user/[name]/Lists
  const player = await getPlayerIdByName(username);
  // const lists = await getUserGameLists();
  const lists: List[] = await getListsByUser(player?.id);
  console.log("custom list", lists);

  return (
    <>
      <div className="mx-4 sm:mx-[2rem]">
        <h2 className="text-2xl mb-6 pb-2 border-b capitalize">
          {username}'s Lists ({lists.length})
        </h2>
        {/* <CreateList /> */}
        <div>
          {lists.length > 0 ? (
            <div className="mt-4 flex flex-col space-x-6 ">
              {lists.map((list, index) => (
                <ListItem key={index} list={list} />
              ))}
            </div>
          ) : (
            <p>{username} has not posted any lists yet</p>
          )}
        </div>
      </div>
      {/* featured, popular this week, recently liked, crew picks */}
    </>
  );
}
