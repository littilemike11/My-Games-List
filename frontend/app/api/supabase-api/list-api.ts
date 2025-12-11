import supabase from "@/app/utils/supabase/client";
import {
  GamePreview,
  List,
  ListType,
  ListVisibility,
  StatusKey,
  Tag,
} from "@/app/types/models";
import { batchUpdatePostTags, getPostTags, upsertTags } from "./tag-api";
import { upsertGame } from "./game-api";
export const getLists = async (
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
    .order("created_at", { referencedTable: "list_games", ascending: false })
    .limit(limit)
    .order(column, { ascending: orderBy === "asc" });

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

export const getListsByGame = async (gameID: number) => {
  const { data, error } = await supabase
    .from("list_games")
    .select("list_id")
    .eq("game_id", gameID);
  if (error) {
    console.error("Error fetching lists: ", error);
    throw error;
  }
  if (data) {
    let listIDs = data.map((id) => id.list_id);
    console.log("lists from game id", gameID, listIDs);

    const lists = await getListsByIDs(listIDs);
    return lists ?? [];
  }
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
export const getOwnListByID = async (listID: number, userID: string) => {
  const query = supabase
    .from("lists")
    .select(
      `
      id,
      created_at,
      title,
      visibility,
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
    .eq("user_id", userID)
    .order("created_at", { referencedTable: "list_games", ascending: false });

  const { data, error } = await query.maybeSingle();

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

  const { data, error } = await query.maybeSingle();

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

export const getListsByIDs = async (
  listIDs: number[],
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
    .in("id", listIDs)
    .eq("visibility", "public")
    .order("created_at", { referencedTable: "list_games", ascending: false });
  if (isPreview) {
    query.limit(5, { referencedTable: "list_games" });
  }

  const { data: lists, error } = await query;

  if (error) {
    console.error("Error fetching list :", error);
    return null;
  }

  if (!lists) return null;
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
  console.log(tags);

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

export const batchUpdateGamesToList = async (
  oldGames: GamePreview[],
  games: GamePreview[],
  list_id: number
) => {
  // convert to sets for easy compare, ensures uniqueness
  const oldSet = new Set(oldGames.flatMap((game) => game.id));
  const newSet = new Set(games.flatMap((game) => game.id));
  // if both sets are equal, no updates
  const eqSet = (xs: Set<number>, ys: Set<number>) =>
    xs.size === ys.size && [...xs].every((x) => ys.has(x));
  console.log(oldSet, newSet);
  if (eqSet(oldSet, newSet)) return;

  const gamesToRemove = [...oldSet].filter((id) => !newSet.has(id));
  const gameIDsToAdd = [...newSet].filter((id) => !oldSet.has(id));
  console.log("game ids to add", gameIDsToAdd);
  const gamesToAdd = games.filter((game) => gameIDsToAdd.includes(game.id));
  console.log(games);
  console.log("games to add", gamesToAdd);
  await Promise.all([
    batchAddGamesToList(gamesToAdd, list_id),
    batchRemoveGamesFromList(gamesToRemove, list_id),
  ]);

  return {
    added: gamesToRemove,
    removed: gamesToAdd,
  };
};
export const batchAddGamesToList = async (
  games: GamePreview[],
  list_id: number
) => {
  const upsertedGames = await Promise.all(games.map((g) => upsertGame(g)));
  const validGames = upsertedGames.filter((g): g is { id: number } => !!g?.id);

  if (!validGames.length) {
    console.warn("No valid games to insert into list.");
    return [];
  }

  // Prepare list-game relationships
  const listGameEntries = validGames.map((g) => ({
    game_id: g.id,
    list_id,
  }));
  const { data, error } = await supabase
    .from("list_games")
    .insert(listGameEntries)
    .select();

  if (error) {
    console.error("Error Updating List", error);
    throw error;
  }
  return data;
};

export const batchRemoveGamesFromList = async (
  gameIDs: number[],
  list_id: number
) => {
  const { data, error } = await supabase
    .from("list_games")
    .delete()
    .eq("list_id", list_id)
    .in("game_id", gameIDs);

  if (error) {
    console.error("Error removing games", error);
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
  oldGames: GamePreview[],
  games: GamePreview[],
  oldTagIDs: number[],
  newTags: string[],

  updates: {
    title: string;
    visibility: ListVisibility;
    description: string;
  }
) => {
  // update basic list info (title, visibility, description)
  const { data: list, error } = await supabase
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
  // updating new tags if any
  // upsert tags
  const tagRows = await upsertTags(newTags);
  const newTagIDs = tagRows.flatMap((tag) => tag.id);

  await batchUpdatePostTags(oldTagIDs, newTagIDs, "list", list_id);
  await batchUpdateGamesToList(oldGames, games, list_id);
  return { ...list, tags: newTagIDs };
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
