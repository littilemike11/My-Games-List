import Tabs from "@/app/components/Tabs";
import CreateList from "@/app/components/CreateList";
import { getLists } from "@/app/api/supabase-api/list-api";
import ListItem from "@/app/components/ListItem";
export default async function ListsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const sort =
    (resolvedSearchParams.sort as "likes" | "comments" | "date") ?? "likes";

  const order = (resolvedSearchParams.order as "asc" | "desc") ?? "desc";

  const lists = await getLists(50, sort, order);

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl text-pretty text-center font-bold">Lists</h1>
        <Tabs />
        <CreateList />
        {/* <ul className="list mt-4 space-y-5">
          {lists.map((list, index) => (
            <li className="list-item" key={index}>
              <ListItem list={list} />
            </li>
          ))}
        </ul> */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {lists.map((list, index) => (
            <ListItem key={index} list={list} />
          ))}
        </div>
      </div>
    </>
  );
}
