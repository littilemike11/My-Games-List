import { contentType } from "@/app/types/models";
import supabase from "@/app/utils/supabase/client";

export const getCommentsFromPost = async (
  content_type: string,
  content_id: number
) => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
    id,
    body,
    created_at,
    likes,
    dislikes,
    comment_count,
    parent_id,
    profile:user_id (
      id,
      username,
      avatar
    ),
    replies:comments(id,
      body,
      user_id,
      created_at,
      likes,
      dislikes,
      comment_count,
      parent_id,
      profile:user_id (
        id,
        username,
        avatar
      ) 
    )
  `
    )
    .eq("content_type", content_type)
    .eq("content_id", content_id)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("error getting comments", error);
    throw error;
  }

  const mappedData = data.map((comment: any) => ({
    ...comment,
    profile: comment.profile,
  }));

  return mappedData;
};

// get top comment if exists
export const getTopComment = async (
  content_type: contentType,
  content_id: number
) => {
  const { data, error } = await supabase
    .from("comments")
    // PROFILE: FOR SINGULAR RETURN FROM DATABASE
    /////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    .select(
      `id, body, profile:profiles(username,avatar), created_at, likes, dislikes, comment_count, parent_id`
    )
    .eq("content_type", content_type)
    .eq("content_id", content_id)
    .is("parent_id", null)
    .order("likes", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.log("error getting top comment ", error);
    throw error;
  }
  return data
    ? {
        ...data,
        profile: Array.isArray(data.profile) ? data.profile[0] : data.profile,
      }
    : undefined;
};

export const createComment = async (
  body: string,
  user_id: string,
  content_type: contentType,
  content_id: number,
  parent_id?: number
) => {
  const { data, error } = await supabase
    .from("comments")
    .insert([{ body, user_id, content_type, content_id, parent_id }])
    .select()
    .single();
  if (error) {
    console.log("error leaving comment:", error);
    throw error;
  }
  return data;
};

export const updateComment = async (
  newBody: string,
  comment_id: number,
  user_id: string
) => {
  const { data, error } = await supabase
    .from("comments")
    .update(["body", newBody])
    .eq("id", comment_id)
    .eq("user_id", user_id)
    .select()
    .single();
  if (error) {
    console.error("Error Updating comment", error);
    throw error;
  }
  return data;
};

export const deleteComment = async (comment_id: number, user_id: string) => {
  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", comment_id)
    .eq("user_id", user_id);
  if (error) {
    console.error("Error deleting Comment", error);
    throw error;
  }
  return data;
};
