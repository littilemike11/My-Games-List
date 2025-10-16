import supabase from "@/supabase-client";

//get all users
export const getPlayers = async (limit: number = 5) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,created_at,username,avatar, total_xp")
    .order("total_xp", { ascending: false })
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
export const getPlayerByName = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,created_at,username,avatar,bio,total_xp")
    .ilike("username", username)
    .single();
  if (error) {
    console.error("Error getting user", error);
    throw error;
  }
  return data;
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
    avatar: string;
    bio: string;
  }
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user_id)
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
      "follower:profiles!user_follows_follower_id_fkey(id, username, avatar)"
    )
    .eq("following_id", user_id);

  if (error) {
    console.error("Error getting followers", error);
    throw error;
  }
  return data?.map((row) => row.follower);
};

// all who user_id is following
export const getFollowing = async (user_id: string) => {
  const { data, error } = await supabase
    .from("user_follows")
    .select(
      "following:profiles!user_follows_following_id_fkey(id, username, avatar)"
    )
    .eq("follower_id", user_id);

  if (error) {
    console.error("Error getting following", error);
    throw error;
  }
  return data?.map((row) => row.following);
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
