import { getLists, getUserGameLists } from "../api/supabase-api/list-api";
import CreateList from "../components/CreateList";
import ListItem from "../components/ListItem";
export default async function ListsPage() {
  // const lists = await getLists();
  const lists = await getLists();
  console.log(lists);

  return (
    <>
      <h1 className="text-3xl mb-4">Lists</h1>
      <CreateList />
      <div>
        {lists.map((list, index) => (
          <ListItem key={index} list={list} />
        ))}
      </div>
      {/* featured, popular this week, recently liked, crew picks */}
    </>
  );
}
