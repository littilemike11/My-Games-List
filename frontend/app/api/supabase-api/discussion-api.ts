import supabase from "@/app/utils/supabase/client";
import {
  batchUpdatePostTags,
  getPostsByTags,
  getPostTags,
  getTagsByName,
  upsertTags,
} from "./tag-api";
import { Tag } from "@/app/types/models";
import { batchUpdateGamesToList } from "./list-api";

export const getDiscussions = async (
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
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,tags,profile:profiles(id, username,avatar)"
    )
    .order(column, { ascending: orderBy === "asc" })
    .limit(limit);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = await Promise.all(
    data.map(async (discussion: any) => ({
      ...discussion,
      profile: discussion.profile,
      tags: await getPostTags("discussion", discussion.id),
    }))
  );

  return mappedData;
};

export const searchDiscussions = async (query: string, limit: number = 5) => {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,tags,profile:profiles(id, username,avatar)"
    )
    .ilike("title", `%${query}%`)
    .limit(limit);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = await Promise.all(
    data.map(async (discussion: any) => ({
      ...discussion,
      profile: discussion.profile,
      tags: await getPostTags("discussion", discussion.id),
    }))
  );

  return mappedData;
};

export const getDiscussionsByTag = async (tag: string) => {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,tags,profile:profiles(id, username,avatar)"
    )
    .contains("tags", [tag]);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = await Promise.all(
    data.map(async (discussion: any) => ({
      ...discussion,
      profile: discussion.profile,
      tags: await getPostTags("discussion", discussion.id),
    }))
  );

  return mappedData;
};

export const getDiscussionsByTags = async (tags: string[]) => {
  //get tag ids
  const tagRows = await getTagsByName(tags);
  console.log("tags", tagRows);
  let tagIds = tagRows.map((tag) => tag.id);

  //get discussions from tag ids
  const discussionsIds = (await getPostsByTags(tagIds, "discussion")).map(
    (id) => id.parent_id
  );
  console.log("discussion ids", discussionsIds);
  // get dicussion info
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,profile:profiles(id, username,avatar)"
    )
    .in("id", discussionsIds);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = await Promise.all(
    data.map(async (discussion: any) => ({
      ...discussion,
      profile: discussion.profile,
      tags: await getPostTags("discussion", discussion.id),
    }))
  );

  return mappedData;
};

export const getDiscussionsByUser = async (id: string) => {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id, created_at, title, content, likes, dislikes, comment_count, tags, profile:profiles(id, username, avatar)"
    )
    .eq("user_id", id);

  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }

  // Wait for all async tag fetches to resolve
  const mappedData = await Promise.all(
    data.map(async (discussion: any) => ({
      ...discussion,
      profile: discussion.profile,
      tags: await getPostTags("discussion", discussion.id),
    }))
  );

  return mappedData;
};

export const getDiscussionByID = async (discussionID: number) => {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,tags,profile:profiles(id,username,avatar)"
    )
    .eq("id", discussionID)
    .maybeSingle();
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  if (!data) return null;
  const tags = await getPostTags("discussion", discussionID);

  const mappedData = {
    ...data,
    profile: data.profile?.[0] ?? data.profile,
    tags: (Array.isArray(tags) ? tags.flat() : []) as Tag[],
  };
  return mappedData;
};

export const getOwnDiscussionByID = async (
  user_id: string,
  discussionID: number
) => {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,tags,profile:profiles(id,username,avatar)"
    )
    .eq("id", discussionID)
    .eq("user_id", user_id)
    .maybeSingle();
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  if (!data) return null;
  const tags = await getPostTags("discussion", discussionID);

  const mappedData = {
    ...data,
    profile: data.profile?.[0] ?? data.profile,
    tags: (Array.isArray(tags) ? tags.flat() : []) as Tag[],
  };
  return mappedData;
};

export const createDiscussion = async ({
  user_id,
  title,
  content,
  tags,
}: {
  user_id: string;
  title: string;
  content: string;
  tags: string[];
}) => {
  // insert discussion
  const { data: discussion, error } = await supabase
    .from("discussions")
    .insert([{ user_id, title, content, tags }])
    .select()
    .single();
  if (error) {
    console.log("Error Inserting: ", error);
    throw error;
  }

  // upsert tags
  const tagRows = await upsertTags(tags);
  // get tag ids
  const tagLinks = tagRows.map((tag) => ({
    parent_type: "discussion",
    parent_id: discussion.id,
    tag_id: tag.id,
  }));

  const { error: linkError } = await supabase
    .from("tag_links")
    .insert(tagLinks);

  if (linkError) throw linkError;

  return { ...discussion, tags: tagRows };
};

//user cant change user id or ownership
export const updateDiscussion = async (
  id: number,
  user_id: string,
  oldTagIDs: number[],
  tags: string[],
  updates: {
    title: string;
    content: string;
  }
) => {
  const { data: discussion, error } = await supabase
    .from("discussions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user_id)
    .select()
    .single();
  if (error) {
    console.error("Error Updating discussion", error);
    throw error;
  }
  // updating new tags if any
  // upsert tags
  const tagRows = await upsertTags(tags);
  const newTagIDs = tagRows.flatMap((tag) => tag.id);

  await batchUpdatePostTags(oldTagIDs, newTagIDs, "discussion", id);
  return { ...discussion, tags: newTagIDs };
};

export const deleteDiscussion = async (id: number, user_id: string) => {
  const { data, error } = await supabase
    .from("discussions")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);
  if (error) {
    console.error("Error deleting discussion", error);
    throw error;
  }
  return data;
};
