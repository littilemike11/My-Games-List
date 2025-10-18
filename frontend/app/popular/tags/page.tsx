import { getPopularTags } from "@/app/api/supabase-api/tag-api";
import FollowTagButton from "@/app/components/FollowTagButton";
import Tabs from "@/app/components/Tabs";
import TagItem from "@/app/components/TagItem";
export default async function TagsPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string };
}) {
  const sort = (searchParams.sort as "usage" | "followers" | "name") || "usage";
  const order = (searchParams.order as "asc" | "desc") || "desc";

  const tags = await getPopularTags(50, sort, order);
  console.log(tags);

  return (
    <>
      <div>
        <h1 className="text-4xl text-pretty text-center font-bold">Tags</h1>
        <Tabs />
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
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <li
              key={tag.tag_id}
              className="card bg-base-100 shadow-md hover:shadow-lg transition rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <TagItem
                  tag={{
                    id: tag.tag_id,
                    name: tag.name,
                    description: tag.description,
                    type: tag.type,
                  }}
                />
                <FollowTagButton TagID={tag.tag_id} />
              </div>
              <p className="text-sm line-clamp-3">
                {tag.description || "No description available."}
              </p>
              <div className="flex items-center justify-between text-sm text-base-content/70 mt-auto pt-2 border-t border-base-300">
                <span>
                  Used: <span className="font-semibold">{tag.usage_count}</span>
                </span>
                <span>
                  Followers:{" "}
                  <span className="font-semibold">{tag.follow_count}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
