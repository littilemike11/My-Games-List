"use client";

import DiscussionItem from "@/app/components/DiscussionItem";
import { Discussion } from "@/app/types/models";

export default function DiscussionResults({
  query,
  discussions,
}: {
  query: string;
  discussions: Discussion[];
}) {
  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold mb-2">
          Discussions matching <span className="text-primary">"{query}"</span>
        </h1>
        <p className="text-sm text-gray-500">
          {discussions.length} result
          {discussions.length !== 1 && "s"} found
        </p>
      </div>

      {discussions.length ? (
        discussions.map((d) => <DiscussionItem key={d.id} discussion={d} />)
      ) : (
        <p className="text-error text-center mt-10">No discussions found</p>
      )}
    </main>
  );
}
