"use client";
import { List } from "@/app/types/models";
import ListItem from "@/app/components/ListItem";

export default function ListResults({
  query,
  lists,
}: {
  query: string;
  lists: List[];
}) {
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
          <div className="mt-4 flex flex-col space-y-6">
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
}
