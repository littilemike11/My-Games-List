import { taggableContent } from "@/app/types/models";
import supabase from "@/app/utils/supabase/client";

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

export const getPostsByTags = async (tagIds: number[]) => {
  const { data, error } = await supabase
    .from("posts_by_tag")
    .select("*")
    .in("tag_id", tagIds);
  if (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
  return data ?? [];
};
export const getPostsByUserIds = async (user_ids: string[]) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .in("user_id", user_ids);
  if (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
  return data ?? [];
};

export const getPostByID = async (
  postType: taggableContent,
  postID: number
) => {
  const { data, error } = await supabase
    .from(`${postType}s`)
    .select("user_id")
    .eq("id", postID)
    .single();
  if (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
  return data;
};
