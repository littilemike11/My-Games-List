import supabase from "@/supabase-client";
import { ListType, ListVisibility, StatusKey } from "@/app/types/models";
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

// may make a new join table for custom lists with user, game and list info
export const getListsByUser = async (ownerName: string) => {
  const { data, error } = await supabase
    .from("user_custom_lists")
    .select(
      "username, list_title, list_tags, list_description,list_likes, list_dislikes, game_slug, game_cover, game_name, custom_lists"
    )
    .ilike("username", ownerName)
    // .neq("visibility", "private")
    .not("custom_lists", "is", null);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }

  return data;
};

export const getUserGameLists = async (
  status?: ListType,
  username?: string,
  game_slug?: string
) => {
  let query = supabase
    .from("user_game_lists")
    .select(
      "user_id, username, game_cover,game_id,game_name,game_slug, played, playing, wishlist, favorite, custom_lists"
    );
  if (username) {
    query = query.eq("username", username);
  }
  if (status) {
    query = query.eq(status, true);
  }
  if (game_slug) {
    query = query.eq("game_slug", game_slug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data;
};
// get 1 specific game
export const getUserGame = async (
  status?: ListType,
  user_id?: string,
  game_id?: number
) => {
  let query = supabase
    .from("user_games")
    .select("played, playing,wishlist, favorite");
  if (user_id) {
    query = query.eq("user_id", user_id);
  }
  if (status) {
    query = query.eq(status, true);
  }
  if (game_id) {
    query = query.eq("game_id", game_id);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data ?? [];
};

//get all of a user's games
export const getUserGames = async (userID: string) => {
  const { data, error } = await supabase
    .from("user_games")
    .select("games(id,slug,cover,name),played,playing,wishlist,favorite")
    .eq("user_id", userID);
  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }
  // Map each row to rename 'games' → 'game'
  const mappedData = data.map((row: any) => ({
    played: row.played,
    playing: row.playing,
    wishlist: row.wishlist,
    favorite: row.favorite,
    game: row.games,
  }));

  return mappedData;
};

// export const getUserGameLists = async (
//   type?: string,
//   username?: string,
//   game_slug?: string
// ) => {
//   let query = supabase
//     .from("user_game_lists")
//     .select(
//       "user_id,username,list_id,list_title,list_tags,list_type,list_description,list_likes,list_dislikes,game_id,game_slug,game_cover,game_name"
//     );

//   if (username) {
//     query = query.eq("username", username);
//   }
//   if (type) {
//     query = query.eq("list_type", type);
//   }
//   if (game_slug) {
//     query = query.eq("game_slug", game_slug);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching games: ", error);
//     throw error;
//   }

//   return data ?? [];
// };

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
  type?: ListType;
  visibility: ListVisibility;
  description?: string;
  user_id: string;
}) => {
  const { data, error } = await supabase
    .from("lists")
    .insert({
      title,
      tags,
      type,
      visibility,
      description,
      user_id,
    })
    .select()
    .single();
  if (error) {
    console.log("Error Inserting list: ", error);
    throw error;
  }
  return data;
};

// upsert user game status
export const upsertUserGameStatus = async (
  game_id: number,
  user_id: string,
  status: StatusKey,
  statusValue: boolean
) => {
  // Build object with dynamic key
  const payload = {
    game_id,
    user_id,
    [status]: statusValue, // <-- dynamic column
  };

  const { data, error } = await supabase
    .from("user_games")
    .upsert(payload, { onConflict: "user_id,game_id" }) // Without onConflict, Supabase tries a plain insert, triggering the duplicate key error.
    .select()
    .single();

  if (error) {
    console.error("Error updating game status", error);
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

export const batchAddGamesToList = async (
  game_ids: number[],
  list_id: number
) => {
  const insertGames = game_ids.map((id) => ({
    game_id: id,
    list_id,
  }));
  const { data, error } = await supabase
    .from("list_games")
    .insert(insertGames)
    .select();
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
