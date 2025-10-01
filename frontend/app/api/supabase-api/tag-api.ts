import { tagableContent } from "@/app/types/models";
import supabase from "@/supabase-client";

// search tags
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

//tags cannot be deleted by users only admins
export const getPostsByTags = async (
  tagIds: number[],
  parent_type: tagableContent
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
  parent_type: tagableContent,
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
  tags: { tag_id: number; parent_type: tagableContent; parent_id: number }[]
) => {
  const { data, error } = await supabase
    .from("tag_links")
    .insert(tags)
    .select();

  if (error) {
    console.error("Error adding tags: ", error);
    throw error;
  }
  return data;
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
export const batchRemoveTags = async (ids: number[]) => {
  const { data, error } = await supabase
    .from("tag_links")
    .delete()
    .in("id", ids);

  if (error) {
    console.error("Error removing tags: ", error);
    throw error;
  }
  return data;
};
