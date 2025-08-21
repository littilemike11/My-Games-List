import supabase from "@/supabase-client";

//get all users
export const getPlayers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,created_at,username,avatar");
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  return data;
};

// get a single user
export const getPlayerByName = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,created_at,username,avatar,bio")
    .ilike("username", username)
    .single();
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

// delete handled by user delete
