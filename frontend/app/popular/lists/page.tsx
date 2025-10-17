import Tabs from "@/app/components/Tabs";
import CreateList from "@/app/components/CreateList";
import { getLists } from "@/app/api/supabase-api/list-api";
import ListItem from "@/app/components/ListItem";
export default async function ListsPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string };
}) {
  const sort = (searchParams.sort as "likes" | "comments" | "date") || "likes";
  const order = (searchParams.order as "asc" | "desc") || "desc";

  const lists = await getLists(50, sort, order);
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl text-pretty text-center font-bold">Lists</h1>
        <Tabs />
        <CreateList />
        <div>
          {lists.map((list, index) => (
            <ListItem key={index} list={list} />
          ))}
        </div>
      </div>
    </>
  );
}
