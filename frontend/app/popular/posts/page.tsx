import Tabs from "@/app/components/Tabs";
import ReviewItem from "@/app/components/ReviewItem";
import ListItem from "@/app/components/ListItem";
import DiscussionItem from "@/app/components/DiscussionItem";
import { getPosts } from "@/app/api/supabase-api/post-api";
export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const sort =
    (resolvedSearchParams.sort as "likes" | "comments" | "date") ?? "likes";

  const order = (resolvedSearchParams.order as "asc" | "desc") ?? "desc";

  const posts = await getPosts(50, sort, order);

  return (
    <>
      <div>
        <h1 className="text-4xl text-pretty text-center font-bold">Posts</h1>
        <Tabs />
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
                  <ListItem
                    list={{
                      id: post.parent_id,
                      title: post.title,
                      description: post.content,
                      created_at: post.created_at,
                      likes: post.likes,
                      dislikes: post.dislikes,
                      comment_count: post.comment_count,
                      visibility: post.visibility,
                      profile: {
                        avatar: post.author_avatar,
                        username: post.author_name,
                        id: post.user_id,
                      },
                      games: post.games,
                      tags: post.tags,
                    }}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
}
