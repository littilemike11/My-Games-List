import supabase from "@/supabase-client";
import { Review } from "@/app/types/models";
export const getReviews = async () => {
  const { data, error } = await supabase.from("reviews").select("*");
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  return data;
};

export const createReview = async (review: Review) => {
  const { data, error } = await supabase.from("reviews").insert({
    title: review.title,
    content: review.text,
    rating: review.rating,
    game_id: review.gameID,
    user_id: review.userID,
    platform: review.platform,
    hours_played: review.hoursPlayed,
  });
  if (error) {
    console.log("Error Inserting: ", error);
    throw error;
  }
  return data;
};

// users cannot update user or game id
// users can only update their own reviews
export const updateReview = async (
  id: number,
  updates: {
    title?: string;
    content?: string;
    rating?: number;
    platform?: string;
    hours_played?: number;
  }
) => {
  const { data, error } = await supabase
    .from("reviews")
    .upsert(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.log("Error updating:", error);
    throw error;
  }
  return data;
};

export const deleteReview = async (id: number) => {
  const { data, error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) {
    console.error("Error deleting review", error);
    throw error;
  }
  return data;
};
