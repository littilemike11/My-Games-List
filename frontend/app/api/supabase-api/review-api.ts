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
