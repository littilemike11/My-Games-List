import supabase from "@/supabase-client";
import { ListType, ListVisibility } from "@/app/types/models";
export const getLists = async () => {
  const { data, error } = await supabase
    .from("lists")
    .select("title,tags, description")
    .neq("visibility", "private"); // get public or friends lists
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = data.map((list: any) => ({
    ...list,
    profiles: list.profiles,
    tags: list.games,
  }));

  return mappedData;
};

export const getListsByUser = async (owner_id: number) => {
  const { data, error } = await supabase
    .from("list")
    .select("title,tags,description")
    .eq("user_id", owner_id)
    .neq("visibility", "private");
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = data.map((list: any) => ({
    ...list,
    profiles: list.profiles,
    tags: list.games,
  }));

  return mappedData;
};

//user created lists
export const createList = async ({
  title,
  tags,
  type = "custom",
  visibility,
  description,
  user_id,
}: {
  title: string;
  tags: string[];
  type: ListType;
  visibility: ListVisibility;
  description: string;
  user_id: string;
}) => {
  const { data, error } = await supabase.from("lists").insert({
    title,
    tags,
    type,
    visibility,
    description,
    user_id,
  });
  if (error) {
    console.log("Error Inserting list: ", error);
    throw error;
  }
  return data;
};

export const updateList = async (
  user_id: string,
  list_id: number,
  updates: {
    title: string;
    tags: string[];
    visibility: ListVisibility;
    description: string;
  }
) => {
  const { data, error } = await supabase
    .from("lists")
    .update(updates)
    .eq("id", list_id)
    .eq("user_id", user_id)
    .select()
    .single();
  if (error) {
    console.error("Error Updating List", error);
    throw error;
  }
  return data;
};

export const deleteList = async (list_id: number, user_id: string) => {
  const { data, error } = await supabase
    .from("lists")
    .delete()
    .eq("id", list_id)
    .eq("user_id", user_id);
  if (error) {
    console.error("Error deleting list", error);
    throw error;
  }
  return data;
};
