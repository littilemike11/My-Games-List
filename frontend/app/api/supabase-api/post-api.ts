import supabase from "@/supabase-client";

//get posts
export const getPosts = async (
  limit: number = 5,
  sortBy: "likes" | "comments" | "date" = "likes",
  orderBy: "asc" | "desc" = "desc"
) => {
  let column = "";
  switch (sortBy) {
    case "likes":
      column = "likes";
      break;
    case "comments":
      column = "comment_count";
      break;
    case "date":
      column = "created_at";
      break;
    default:
      column = "likes";
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order(column, { ascending: orderBy === "asc" })
    .limit(limit);
  if (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
  return data;
};
export const getPostsByTag = async (tagId: number) => {
  const { data, error } = await supabase
    .from("posts_by_tag")
    .select("*")
    .eq("tag_id", tagId);
  if (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
  return data;
};
