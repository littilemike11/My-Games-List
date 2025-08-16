import { getLists } from "../api/supabase-api/list-api";
import ListItem from "../components/ListItem";
export default async function ListsPage() {
  const lists = await getLists();
  console.log(lists);
  return (
    <>
      <h1>Lists</h1>
      <div>
        {/* {lists.map((list, index) => (
          <ListItem key={index} list={list} />
        ))} */}
      </div>
    </>
  );
}
