import supabase from "@/app/utils/supabase/client";

export const checkUsername = async (inputName: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", inputName)
    .maybeSingle();
  if (data) {
    return true;
  }
  return false;
};

//get all users
export const getPlayers = async (
  limit: number = 5,
  sortBy: "level" | "followers" | "name" = "level",
  orderBy: "asc" | "desc" = "desc"
) => {
  let column = "level";
  switch (sortBy) {
    case "level":
      column = "total_xp";
      break;
    case "followers":
      column = "follower_count";
      break;
    case "name":
      column = "username";
      break;
    default:
      column = "level";
  }
  const { data, error } = await supabase
    .from("profile_with_followers")
    .select("id,created_at,username,avatar, total_xp, follower_count")
    .order(column, { ascending: orderBy === "asc" })
    .limit(limit);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  return data;
};

//search users
export const searchPlayers = async (query: string, limit: number = 5) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,created_at,username,avatar,bio,total_xp")
    .ilike("username", `%${query}%`)
    .limit(limit);
  if (error) {
    console.error("Error getting user", error);
    throw error;
  }
  return data ?? [];
};

// get a single user
export const getPlayerByID = async (userID: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,created_at,username,avatar,bio,total_xp,is_admin")
    .eq("id", userID)
    .single();
  if (error) {
    console.error("Error getting user", error);
    throw error;
  }
  return data ?? null;
};
// get a single user
export const getPlayerByName = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,created_at,username,avatar,bio,total_xp,is_admin")
    .ilike("username", username)
    .single();
  if (error) {
    console.error("Error getting user", error);
    throw error;
  }
  return data ?? null;
};
export const getPlayerIdByName = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();
  if (error) {
    console.error("Error getting user", error);
    throw error;
  }
  return data;
};

// update profile
//can maybe change username
export const updateProfile = async (
  user_id: string,
  updates: {
    // avatar: string;
    bio: string;
  }
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user_id)
    .select()
    .single();
  if (error) {
    console.error("Error getting user", error);
    throw error;
  }
  return data;
};

// follower info
// all who follow user_id
export const getFollowers = async (user_id: string) => {
  const { data, error } = await supabase
    .from("user_follows")
    .select(
      "follower:profiles!user_follows_follower_id_fkey(id, username, avatar, total_xp)"
    )
    .eq("following_id", user_id);

  if (error) {
    console.error("Error getting followers", error);
    throw error;
  }
  return data?.flatMap((row) => row.follower);
};

// all who user_id is following
export const getFollowing = async (user_id: string) => {
  const { data, error } = await supabase
    .from("user_follows")
    .select(
      "following:profiles!user_follows_following_id_fkey(id, username, avatar, total_xp)"
    )
    .eq("follower_id", user_id);

  if (error) {
    console.error("Error getting following", error);
    throw error;
  }
  return data?.flatMap((row) => row.following);
};

// all who user_id is following
export const getFollowingIDs = async (user_id: string) => {
  const { data, error } = await supabase
    .from("user_follows")
    .select("following_id")
    .eq("follower_id", user_id);

  if (error) {
    console.error("Error getting following", error);
    throw error;
  }
  return data?.map((row) => row.following_id);
};

export const getPlayerStats = async (user_id: string) => {
  const { data, error } = await supabase
    .from("profile_stats")
    .select("follower_count, following_count")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    console.error("Error getting following", error);
    throw error;
  }
  return data;
};

export const checkFollowing = async (
  follower_id: string,
  following_id: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("user_follows")
    .select("id") // just grab id, no need for all columns
    .eq("follower_id", follower_id)
    .eq("following_id", following_id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found, not an actual error
    console.error("Error checking following", error);
    throw error;
  }

  return !!data; // true if row exists, false otherwise
};

// follower_id(current user id)  follows following_id
export const followUser = async (follower_id: string, following_id: string) => {
  const { data, error } = await supabase
    .from("user_follows")
    .insert([{ follower_id, following_id }])
    .select()
    .single();

  if (error) {
    console.error("Error following user", error);
    throw error;
  }
  return data;
};

// remove follower_id(current user id) from following_id
export const unfollowUser = async (
  follower_id: string,
  following_id: string
) => {
  const { data, error } = await supabase
    .from("user_follows")
    .delete()
    .eq("follower_id", follower_id)
    .eq("following_id", following_id);
  if (error) {
    console.error("Error removing follow", error);
    throw error;
  }
  return data;
};

// delete handled by user delete
