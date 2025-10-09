import { getTag } from "@/app/api/supabase-api/tag-api";
import { Tag } from "@/app/types/models";
import { getPostsByTag } from "@/app/api/supabase-api/tag-api";
import ReviewItem from "@/app/components/ReviewItem";
import DiscussionItem from "@/app/components/DiscussionItem";

interface Props {
  params: { name: string };
}
export default async function TagPage({ params }: Props) {
  const tag: Tag = await getTag(params.name);
  const posts = await getPostsByTag(tag.id);

  console.log(posts);

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pretty capitalize">
          {tag.name}
        </h1>

        <p className="mt-2">
          {tag?.description || `Post tagged with "${tag.name}"`}
        </p>

        {/* {posts && <PostList posts={posts} />} */}

        {/* Posts feed */}
        <div className="mt-6 space-y-6">
          {posts.map((post, index) => {
            if (post.parent_type === "review") {
              return (
                <div key={index}>
                  <ReviewItem
                    review={{
                      id: post.parent_id,
                      title: post.title,
                      content: post.content,
                      hours_played: post.hours_played,
                      platform: post.platform,
                      rating: post.rating,
                      created_at: post.created_at,
                      likes: post.likes,
                      dislikes: post.dislikes,
                      comment_count: post.comment_count,
                      game: {
                        cover: post.game_cover,
                        name: post.game_name,
                        id: post.game_id,
                        slug: post.game_slug,
                      },
                      profile: {
                        avatar: post.author_avatar,
                        username: post.author_name,
                        id: post.user_id,
                      },
                      tags: post.tags,
                    }}
                  />
                </div>
              );
            } else if (post.parent_type === "discussion") {
              return (
                <div key={index}>
                  <DiscussionItem
                    discussion={{
                      id: post.parent_id,
                      title: post.title,
                      content: post.content,
                      created_at: post.created_at,
                      likes: post.likes,
                      dislikes: post.dislikes,
                      comment_count: post.comment_count,
                      profile: {
                        avatar: post.author_avatar,
                        username: post.author_name,
                        id: post.user_id,
                      },
                      tags: post.tags,
                    }}
                  />
                </div>
              );
            } else if (post.parent_type === "list") {
              return (
                <div key={index}>
                  {/* <ListItem
            list={{
              title: post.title,
              description: post.content,
              created_at: post.created_at,
              likes: post.likes,
              dislikes: post.dislikes,
              comment_count: post.comment_count,
              visibility: post.visibility,
              profile: {
                avatar: post.author_avatar,
                name: post.author_name,
                id: post.user_id,
              },
              tags: post.tags,
            }}
          /> */}
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
}
