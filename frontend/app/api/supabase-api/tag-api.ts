import { taggableContent } from "@/app/types/models";
import supabase from "@/app/utils/supabase/client";

// search tags

//get most followed tags
export const getTags = async (limit: number = 5) => {
  const { data, error } = await supabase
    .from("tags")
    .select("id,name,type, description")
    // .order("follows", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }
  return data;
};

//get most used tag link
export const getPopularTags = async (
  limit: number = 5,
  sortBy: "usage" | "followers" | "name" = "usage",
  orderBy: "asc" | "desc" = "desc"
) => {
  let column = "usage_count";
  switch (sortBy) {
    case "usage":
      column = "usage_count";
      break;
    case "followers":
      column = "follow_count";
      break;
    case "name":
      column = "name";
      break;
    default:
      column = "usage_count";
  }
  const { data, error } = await supabase
    .from("tag_stats")
    .select("tag_id, usage_count, follow_count,name,description,type")
    .order(column, { ascending: orderBy === "asc" })
    .limit(limit);
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }
  return data;
};

export const searchTags = async (
  name: string,
  restricted: boolean = false,
  limit: number = 5
) => {
  let query = supabase
    .from("tags")
    .select("id,name,description,type, owner_id")
    .ilike("name", `%${name}%`) // search substring
    .limit(limit);

  if (!restricted) {
    query = query.neq("type", "restricted");
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data ?? [];
};

export const getTag = async (tagName: string) => {
  const { data, error } = await supabase
    .from("tags")
    .select("id,name,description,type")
    .eq("name", tagName)
    .maybeSingle();
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data;
};

export const getTagsByName = async (tags: string[]) => {
  const { data, error } = await supabase
    .from("tags")
    .select("id,name")
    .in("name", tags);

  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data;
};

// user creater communtiy tag
export const createTag = async (
  owner_id: string,
  name: string,
  description: string
) => {
  const { data, error } = await supabase
    .from("tags")
    .insert({ owner_id, name, description, type: "community" })
    .select()
    .single();
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data;
};

export const upsertTags = async (tags: string[]) => {
  if (tags.length === 0) return [];

  // 1️⃣ Fetch existing tags
  const { data: existingTags, error: fetchError } = await supabase
    .from("tags")
    .select("id, name, type")
    .in("name", tags);

  if (fetchError) {
    console.error("Error fetching existing tags:", fetchError);
    throw fetchError;
  }

  // 2️⃣ Determine which tags are new
  const existingNames = existingTags?.map((t) => t.name) || [];
  const newTags = tags.filter((name) => !existingNames.includes(name));

  if (newTags.length === 0) return existingTags ?? [];

  // 3️⃣ Prepare rows for insert
  const rows = newTags.map((name) => ({
    name,
    type: "community",
  }));

  // 4️⃣ Insert new tags (no upsert!)
  const { data: insertedTags, error: insertError } = await supabase
    .from("tags")
    .insert(rows)
    .select("id, name, type");

  if (insertError) {
    console.error("Error inserting new tags:", insertError);
    throw insertError;
  }

  // 5️⃣ Return combined array of existing + newly inserted
  return [...(existingTags ?? []), ...(insertedTags ?? [])];
};

// users can only update tag description
export const updateTagDescription = async (
  owner_id: string,
  tag_id: number,
  newDescription: string
) => {
  const { data, error } = await supabase
    .from("tags")
    .update({ description: newDescription })
    .eq("id", tag_id)
    .eq("owner_id", owner_id);
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data;
};

//get all tags from a post
export const getPostTags = async (
  parent_type: taggableContent,
  parent_id: number
) => {
  const { data, error } = await supabase
    .from("tag_links")
    .select("tag:tags(id,name,description,type)")
    .eq("parent_type", parent_type)
    .eq("parent_id", parent_id);
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }
  // flatten
  return data.map((row) => row.tag);
};

//tags cannot be deleted by users only admins
export const getPostsByTags = async (
  tagIds: number[],
  parent_type: taggableContent
) => {
  const { data, error } = await supabase
    .from("tag_links")
    .select("parent_id")
    .eq("parent_type", parent_type)
    .in("tag_id", tagIds);
  if (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
  return data;
};

export const addTag = async (
  tag_id: number,
  parent_type: taggableContent,
  parent_id: Number
) => {
  const { count } = await supabase
    .from("tag_links")
    .select("id", { count: "exact", head: true })
    .eq("parent_type", parent_type)
    .eq("parent_id", parent_id);

  if (count !== null && count >= 10) {
    throw new Error("A post cant have at most 10 tags");
  }
  const { data, error } = await supabase
    .from("tag_links")
    .insert({ tag_id, parent_type, parent_id })
    .select()
    .single();
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }
  return data;
};

// Add multiple tags in one request
export const batchAddTags = async (
  tags: number[],
  parent_type: taggableContent,
  parent_id: number
) => {
  const tagLinks = tags.map((tag) => ({
    parent_type,
    parent_id,
    tag_id: tag,
  }));

  const { data, error } = await supabase.from("tag_links").insert(tagLinks);
  if (error) {
    console.error("Error adding tags: ", error);
    throw error;
  }
  return data;
};

export const batchUpdatePostTags = async (
  oldTagIDs: number[],
  newTagIDs: number[],
  postType: taggableContent,
  postID: number
) => {
  // convert to sets for easy compare, ensures uniqueness
  const oldSet = new Set(oldTagIDs);
  const newSet = new Set(newTagIDs);
  // if both sets are equal, no updates
  const eqSet = (xs: Set<number>, ys: Set<number>) =>
    xs.size === ys.size && [...xs].every((x) => ys.has(x));

  console.log(oldSet, newSet);
  if (eqSet(oldSet, newSet)) return;
  // if oldtagid not in newtag then delete
  const tagsToRemove = [...oldSet].filter((id) => !newSet.has(id));
  // if oldtagid in newtag, do nothing (keep it there)
  // if new tag not in old tag add it
  const tagsToAdd = [...newSet].filter((id) => !oldSet.has(id));
  // if old is [1,2,3]
  // and new is [1,4,5]
  // remove 2,3 add 4,5

  await Promise.all([
    batchAddTags(tagsToAdd, postType, postID),
    batchRemoveTags(tagsToRemove, postType, postID),
  ]);
  return {
    added: tagsToAdd,
    removed: tagsToRemove,
  };
};
export const removeTag = async (id: number) => {
  const { data, error } = await supabase
    .from("tag_links")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }
  return data;
};

// Remove multiple tags by their IDs
export const batchRemoveTags = async (
  TagIDs: number[],
  postType: taggableContent,
  postID: number
) => {
  const { data, error } = await supabase
    .from("tag_links")
    .delete()
    .eq("parent_type", postType)
    .eq("parent_id", postID)
    .in("tag_id", TagIDs);

  if (error) {
    console.error("Error removing tags: ", error);
    throw error;
  }
  return data;
};

export const getFollowedTagIDs = async (user_id: string) => {
  const { data, error } = await supabase
    .from("tag_follows")
    .select("tag_id")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error removing tags: ", error);
    throw error;
  }
  return data.map((tag) => Number(tag.tag_id)) ?? [];
};
export const getFollowedTags = async (user_id: string) => {
  const { data, error } = await supabase
    .from("tag_follows")
    .select("tag:tags(id,name,type,description)")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error removing tags: ", error);
    throw error;
  }

  return data.flatMap((tag) => tag.tag) ?? [];
  // const mappedData = data.map((tag: any) => ({
  //   tag: tag.tag,
  // }));
  // return mappedData;
};

// Following Tags
export const isFollowingTag = async (user_id: string, tag_id: number) => {
  const { data, error } = await supabase
    .from("tag_follows")
    .select("id")
    .eq("user_id", user_id)
    .eq("tag_id", tag_id)
    .maybeSingle();
  if (error) {
    console.error("Error following tag: ", error);
    throw error;
  }
  return data ? true : false;
};
export const followTag = async (user_id: string, tag_id: number) => {
  const { data, error } = await supabase
    .from("tag_follows")
    .insert([{ user_id, tag_id }])
    .select()
    .single();
  if (error) {
    console.error("Error following tag: ", error);
    throw error;
  }
  return data;
};

export const unFollowTag = async (user_id: string, tag_id: number) => {
  const { data, error } = await supabase
    .from("tag_follows")
    .delete()
    .eq("user_id", user_id)
    .eq("tag_id", tag_id);
  if (error) {
    console.error("Error unfollowing tag: ", error);
    throw error;
  }
  return data;
};
