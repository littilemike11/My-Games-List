import supabase from "@/supabase-client";
import {
  List,
  ListType,
  ListVisibility,
  StatusKey,
  Tag,
} from "@/app/types/models";
import { getPostTags, upsertTags } from "./tag-api";
export const getLists = async () => {
  const { data: lists, error } = await supabase
    .from("lists")
    .select(
      `
      id,
      created_at,
      title,
      description,
      likes,
      dislikes,
      comment_count,
      profile:profiles(id, username, avatar),
      games:list_games(
        game:games(id, slug, name, cover)
      )
    `
    )
    .eq("visibility", "public")
    .limit(5, { referencedTable: "list_games" })
    .order("created_at", { referencedTable: "list_games", ascending: false });

  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = await Promise.all(
    lists.map(async (list: any) => ({
      ...list,
      profile: list.profile,
      tags: await getPostTags("list", list.id),
      games: (list.games ?? []).map((g: any) => g.game), // flatten list_games -> games
    }))
  );
  return mappedData;
};

export const searchLists = async (query: string, limit: number = 5) => {
  const { data: lists, error } = await supabase
    .from("lists")
    .select(
      `
      id,
      created_at,
      title,
      description,
      likes,
      dislikes,
      comment_count,
      profile:profiles(id, username, avatar),
      games:list_games(
        game:games(id, slug, name, cover)
      )
    `
    )
    .neq("visibility", "private")
    .ilike("title", `%${query}%`)
    .eq("visibility", "public")
    .limit(5, { referencedTable: "list_games" })
    .order("created_at", { referencedTable: "list_games", ascending: false })
    .limit(limit);

  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = await Promise.all(
    lists.map(async (list: any) => ({
      ...list,
      profile: list.profile,
      tags: await getPostTags("list", list.id),
      games: (list.games ?? []).map((g: any) => g.game), // flatten list_games -> games
    }))
  );
  return mappedData;
};

// may make a new join table for custom lists with user, game and list info
export const getListsByUser = async (ownerID: string) => {
  const { data: lists, error } = await supabase
    .from("lists")
    .select(
      `
      id,
      created_at,
      title,
      description,
      likes,
      dislikes,
      comment_count,
      profile:profiles(id, username, avatar),
      games:list_games(
        game:games(id, slug, name, cover)
      )
    `
    )
    .eq("user_id", ownerID)
    .eq("visibility", "public")
    .limit(5, { referencedTable: "list_games" })
    .order("created_at", { referencedTable: "list_games", ascending: false });

  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = await Promise.all(
    lists.map(async (list: any) => ({
      ...list,
      profile: list.profile,
      tags: await getPostTags("list", list.id),
      games: (list.games ?? []).map((g: any) => g.game), // flatten list_games -> games
    }))
  );
  return mappedData;
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

export const getListByID = async (
  listID: number,
  isPreview: boolean = false
) => {
  const query = supabase
    .from("lists")
    .select(
      `
      id,
      created_at,
      title,
      description,
      likes,
      dislikes,
      comment_count,
      profile:profiles(id, username, avatar),
      games:list_games(
        game:games(id, slug, name, cover)
      )
    `
    )
    .eq("id", listID)
    .eq("visibility", "public")
    .order("created_at", { referencedTable: "list_games", ascending: false });
  if (isPreview) {
    query.limit(5, { referencedTable: "list_games" });
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching list :", error);
    return null;
  }

  if (!data) return null;
  const tags = await getPostTags("list", listID);

  const mappedData: List = {
    ...data,
    profile: Array.isArray(data.profile) ? data.profile[0] : data.profile,
    tags: (Array.isArray(tags) ? tags.flat() : []) as Tag[],
    games: (data.games ?? []).map((g: any) => g.game), // flatten list_games -> games
  };
  return mappedData;
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

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Error fetching games: ", error);
    throw error;
  }

  return data;
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
  const { data: list, error } = await supabase
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
  // upsert tags
  const tagRows = await upsertTags(tags);
  // get tag ids
  const tagLinks = tagRows.map((tag) => ({
    parent_type: "list",
    parent_id: list.id,
    tag_id: tag.id,
  }));

  const { error: linkError } = await supabase
    .from("tag_links")
    .insert(tagLinks);

  if (linkError) throw linkError;

  return { ...list, tags: tagRows };
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
