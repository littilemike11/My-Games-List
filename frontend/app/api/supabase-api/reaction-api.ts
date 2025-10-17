import { contentType } from "@/app/types/models";
import supabase from "@/app/utils/supabase/client";

//reaction counts is determined by supabase triggers

//get a user's likes
export const getUserReactions = async (
  user_id: string,
  parent_type: contentType,
  parent_id: number
) => {
  const { data, error } = await supabase
    .from("reactions")
    .select("id,is_like")
    .eq("user_id", user_id)
    .eq("parent_type", parent_type)
    .eq("parent_id", parent_id)
    .maybeSingle();
  if (error) {
    console.log("error getting user likes", error);
    throw error;
  }
  return data ?? null;
};

// add or update reaction
export const addReaction = async (
  user_id: string,
  parent_type: contentType,
  parent_id: number,
  is_like: boolean
) => {
  const { data, error } = await supabase
    .from("reactions")
    .upsert(
      [{ user_id, parent_type, parent_id, is_like }],
      { onConflict: "user_id,parent_type,parent_id" } // <-- important
    )
    .select()
    .single();

  if (error) {
    console.error("error adding reaction", error);
    throw error;
  }
  return data;
};

//remove reaction
export const removeReaction = async (user_id: string, reaction_id: number) => {
  const { data, error } = await supabase
    .from("reactions")
    .delete()
    .eq("id", reaction_id)
    .eq("user_id", user_id)
    .single();
  if (error) {
    console.error("Error removing like", error);
    throw error;
  }
  return data;
};
