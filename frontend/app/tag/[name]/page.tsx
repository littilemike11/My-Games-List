import { getTag } from "@/app/api/supabase-api/tag-api";
import { Tag } from "@/app/types/models";
import { getPostsByTag } from "@/app/api/supabase-api/post-api";
import FollowTagButton from "@/app/components/FollowTagButton";
import PostList from "@/app/components/PostList";

interface Props {
  params: { name: string };
}
export default async function TagPage({ params }: Props) {
  const tag: Tag = await getTag(params.name);
  const posts = await getPostsByTag(tag.id);

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pretty capitalize">
            {tag.name}
          </h1>
          <FollowTagButton size="large" TagID={tag.id} />
        </div>

        <p className="mt-2 opacity-70">
          {tag?.description || `Posts tagged with "${tag.name}"`}
        </p>

        {/* Posts feed */}
        {posts.length > 0 ? (
          <div className="mt-6 space-y-6">
            <PostList posts={posts} />
          </div>
        ) : (
          <p>nothing tagged with "{params.name}"</p>
        )}
      </div>
    </>
  );
}
