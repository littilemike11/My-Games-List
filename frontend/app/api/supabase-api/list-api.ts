import supabase from "@/supabase-client";
import { ListType, ListVisibility } from "@/app/types/models";
export const getLists = async () => {
  const { data, error } = await supabase
    .from("lists")
    .select("title,tags, description, user_id")
    .neq("visibility", "private"); // get public or friends lists
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = data.map((list: any) => ({
    ...list,
    profiles: list.profiles,
    tags: list.tags,
  }));

  return mappedData;
};

export const getListsByUser = async (owner_id: string) => {
  const { data, error } = await supabase
    .from("lists")
    .select("id,title,tags,type,description")
    .eq("user_id", owner_id)
    .neq("visibility", "private");
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = data.map((list: any) => ({
    ...list,
    profiles: list.profiles,
    tags: list.tags,
  }));

  return mappedData;
};

export const getGamesFromLists = async (
  type?: string,
  username?: string,
  game_slug?: string
) => {
  let query = supabase
    .from("user_game_lists")
    .select(
      "user_id,username,list_id,list_title,list_tags,list_type,list_description,list_likes,list_dislikes,game_id,game_slug,game_cover,game_name"
    );

  if (username) {
    query = query.eq("username", username);
  }
  if (type) {
    query = query.eq("list_type", type);
  }
  if (game_slug) {
    query = query.eq("game_slug", game_slug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data ?? [];
};

//user created lists
export const createList = async ({
  title,
  tags = [],
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

//add game to list
export const addGameToList = async (game_id: number, list_id: number) => {
  const { data, error } = await supabase
    .from("list_games")
    .insert({
      game_id,
      list_id,
    })
    .select()
    .single();
  if (error) {
    console.error("Error Updating List", error);
    throw error;
  }
  return data;
};

//add game to default list by type
// export const addGameByType = async (
//   game_id: number,
//   type: ListType,
//   user_id: string
// ) => {
//     const {data,error} = await supabase.from("list_games").insert({
//         game_id,
//         list_id,
//     })
// };

// batch add games to list

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

// change position of game in list
//may be expensive

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

// remove game from list
export const removeGameFromList = async (game_id: number, list_id: number) => {
  const { data, error } = await supabase
    .from("list_games")
    .delete()
    .eq("list_id", list_id)
    .eq("game_id", game_id);
  if (error) {
    console.error("Error deleting list", error);
    throw error;
  }
  return data;
};
