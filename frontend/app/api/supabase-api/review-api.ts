import supabase from "@/supabase-client";
import { Review } from "@/app/types/models";
export const getReviews = async () => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id,created_at,title,content,rating,likes,dislikes,platform,hours_played, profiles(username,avatar),games(name,cover,slug)"
    );
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  // Map arrays to single objects for profiles and games
  //idk typescript error expect array not object, but supabase return it as an object
  // works w/o this but typescript no like
  const mappedData = data.map((review: any) => ({
    ...review,
    profiles: review.profiles,
    games: review.games,
  }));

  return mappedData;
};

//  i feel a view may not be needed, try again with id and collect info from other table columns
export const getReviewsByGame = async (slug: string) => {
  const { data, error } = await supabase
    .from("reviews_with_game_slug")
    .select("*")
    .eq("game_slug", slug);

  if (error) {
    console.error(`Error Fetching reviews for ${slug}`, error);
    throw error;
  }
  const mappedData = data.map((review: any) => ({
    ...review,

    profiles: review.profiles,
    games: {
      game_id: review.game_id,
      cover: review.game_cover,
      slug: review.game_slug,
      name: review.game_name,
    },
  }));

  return mappedData;
};

export const createReview = async (review: Review) => {
  const { data, error } = await supabase.from("reviews").insert({
    title: review.title,
    content: review.content,
    rating: review.rating,
    game_id: review.game_id,
    user_id: review.user_id,
    platform: review.platform,
    hours_played: review.hours_played,
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
  user_id: string,
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
    .eq("user_id", user_id)
    .select()
    .single();
  if (error) {
    console.log("Error updating:", error);
    throw error;
  }
  return data;
};

export const deleteReview = async (id: number, user_id: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);
  if (error) {
    console.error("Error deleting review", error);
    throw error;
  }
  return data;
};
