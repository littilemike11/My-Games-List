"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchLists } from "@/app/api/supabase-api/list-api";
import { List } from "@/app/types/models";
import ListItem from "@/app/components/ListItem";
const ListResultsPage = () => {
  const searchParams = useSearchParams();
  const [lists, setlists] = useState<List[]>([]);

  const query = searchParams
    .get("q")
    ?.trim()
    .toLowerCase()
    .replace(/[\s+/]+/g, "-")
    .replace(/-+/g, "-");

  useEffect(() => {
    const fetchlists = async () => {
      if (!query) return;
      try {
        const response = await searchLists(query);
        setlists(response);
      } catch (error) {
        console.error(`error fetching lists with ${query}`, error);
      }
    };
    fetchlists();
  }, [query]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <section className="space-y-6">
        {/* Title */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">
            lists matching <span className="text-primary">"{query}"</span>
          </h1>
          <p className="text-sm text-gray-500">
            {lists.length} result{lists.length !== 1 && "s"} found
          </p>
        </div>

        {/* Results */}
        {lists.length > 0 ? (
          <div className="flex flex-col gap-4">
            {lists.map((list) => (
              <ListItem key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <p className="text-error text-center mt-10 text-lg">
            No lists found for "{query}"
          </p>
        )}
      </section>
    </main>
  );
};

export default ListResultsPage;
