import Tabs from "@/app/components/Tabs";
import CreateList from "@/app/components/CreateList";
import { getLists } from "@/app/api/supabase-api/list-api";
import ListItem from "@/app/components/ListItem";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lists", // no need to include site name because global template handles it
  description: "Browse lists from the gaming community on The Save Room.",

  openGraph: {
    title: "Lists",
    description: "Browse lists from the gaming community.",
    url: "https://www.thesaveroom.co/popular/lists",
    type: "website",
    // images: [
    //   {
    //     url: "/og-Lists.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Lists",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lists",
    description: "Browse lists from the gaming community.",
    // images: ["/og-Lists.png"],
  },

  robots: { index: true, follow: true },
};

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
        <div className="mt-4 flex flex-col space-y-6 ">
          {lists.map((list, index) => (
            <ListItem key={index} list={list} />
          ))}
        </div>
      </div>
    </>
  );
}
