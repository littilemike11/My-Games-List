"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchTags } from "@/app/api/supabase-api/tag-api";
import { Tag } from "@/app/types/models";
import TagItem from "@/app/components/TagItem";

const TagResultsPage = () => {
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<Tag[]>([]);

  const query = searchParams
    .get("q")
    ?.trim()
    .toLowerCase()
    .replace(/[\s+/]+/g, "-")
    .replace(/-+/g, "-");

  useEffect(() => {
    const fetchTags = async () => {
      if (!query) return;
      try {
        const response = await searchTags(query);
        setTags(response);
      } catch (error) {
        console.error(`error fetching tags with ${query}`, error);
      }
    };
    fetchTags();
  }, [query]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <section className="space-y-6">
        {/* Title */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">
            Tags matching <span className="text-primary">"{query}"</span>
          </h1>
          <p className="text-sm text-gray-500">
            {tags.length} result{tags.length !== 1 && "s"} found
          </p>
        </div>

        {/* Tag type legend */}
        <div className="bg-base-200 p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2">Understanding tag types</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="badge badge-outline">Community</span> — created
              and used by all players.
            </li>
            <li>
              <span className="badge badge-accent">Official</span> — created by
              admin, used by everyone.
            </li>
            <li>
              <span className="badge badge-error">Restricted</span> — admin-only
              usage.
            </li>
          </ul>
        </div>

        {/* Results */}
        {tags.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <TagItem tag={tag} />
                </div>
                <p className="text-sm line-clamp-3">
                  {tag.description || "No description available."}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-error text-center mt-10 text-lg">
            No tags found for "{query}"
          </p>
        )}
      </section>
    </main>
  );
};

export default TagResultsPage;
