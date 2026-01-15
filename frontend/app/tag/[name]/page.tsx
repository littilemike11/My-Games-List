import { getTag } from "@/app/api/supabase-api/tag-api";
import { Tag } from "@/app/types/models";
import { getPostsByTag } from "@/app/api/supabase-api/post-api";
import FollowTagButton from "@/app/components/FollowTagButton";
import PostList from "@/app/components/PostList";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ name: string }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { name } = await params;
  const tag = await getTag(name);
  if (!tag) {
    return {};
  }

  return {
    title: tag.name,
    description: `Explore all posts tagged with ${tag.name}.${tag.description}`,
  };
}
export default async function TagPage({ params }: Props) {
  const { name } = await params;

  const tag: Tag | null = await getTag(name);
  if (!tag) notFound();

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
          <p>nothing tagged with "{name}"</p>
        )}
      </div>
    </>
  );
}
