import supabase from "@/supabase-client";
import { getPostTags, getTagsByName } from "./tag-api";
export const getReviews = async () => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id,created_at,title,content,rating,likes,dislikes, comment_count ,platform,hours_played, profile:profiles(username,avatar),game:games(id,name,cover,slug)"
    );
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  // Map arrays to single objects for profiles and games
  //idk typescript error expect array not object, but supabase return it as an object
  // works w/o this but typescript no like
  const mappedData = await Promise.all(
    data.map(async (review: any) => ({
      ...review,
      profile: review.profile,
      game: review.game,
      tags: await getPostTags("review", review.id),
    }))
  );

  return mappedData;
};
export const getReviewByID = async (reviewID: number) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id,created_at,title,content,rating,likes,dislikes, comment_count ,platform,hours_played, profile:profiles(username,avatar),game:games(id,name,cover,slug)"
    )
    .eq("id", reviewID);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  // Map arrays to single objects for profiles and games
  //idk typescript error expect array not object, but supabase return it as an object
  // works w/o this but typescript no like
  const mappedData = await Promise.all(
    data.map(async (review: any) => ({
      ...review,
      profile: review.profile,
      game: review.game,
      tags: await getPostTags("review", reviewID),
    }))
  );

  return mappedData;
};

export const searchReviews = async (name: string, limit: number = 5) => {
  const { data, error } = await supabase
    .from("reviews_with_game_slug")
    .select(
      "id,created_at,title,content,rating,likes,dislikes, comment_count ,platform,hours_played, profile:profiles(username,avatar), game_cover, game_slug, game_name"
    )
    .ilike("title", `%${name}%`) // search substring match
    .limit(limit);

  if (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }

  const mappedData = await Promise.all(
    data.map(async (review: any) => ({
      ...review,
      profile: review.profile,
      game: {
        cover: review.game_cover,
        slug: review.game_slug,
        name: review.game_name,
      },
      tags: await getPostTags("review", review.id),
    }))
  );

  return mappedData;
};

//  i feel a view may not be needed, try again with id and collect info from other table columns
export const getReviewsByGame = async (slug: string) => {
  const { data, error } = await supabase
    .from("reviews_with_game_slug")
    .select(
      "id,created_at,title,content,rating,likes,dislikes, comment_count ,platform,hours_played, profile:profiles(username,avatar),game:games(id,name,cover,slug)"
    )
    .eq("game_slug", slug);

  if (error) {
    console.error(`Error Fetching reviews for ${slug}`, error);
    throw error;
  }
  const mappedData = await Promise.all(
    data.map(async (review: any) => ({
      ...review,
      profile: review.profile,
      game: {
        cover: review.game_cover,
        slug: review.game_slug,
        name: review.game_name,
      },
      tags: await getPostTags("review", review.id),
    }))
  );

  return mappedData;
};

// export const getReviewByID = async (id: number) => {
//   const { data, error } = await supabase
//     .from("reviews")
//     .select(
//       "id,created_at,title,content,rating,likes,dislikes, comment_count ,platform,hours_played, profile:profiles(username,avatar),game:games(id,name,cover,slug)"
//     )
//     .eq("id", id)
//     .single();
//   if (error) {
//     console.log("Error fetching: ", error);
//     throw error;
//   }
//   // Map arrays to single objects for profiles and games
//   //idk typescript error expect array not object, but supabase return it as an object
//   // works w/o this but typescript no like
//   return data
//     ? {
//         ...data,
//         profile: Array.isArray(data.profile) ? data.profile[0] : data.profile,
//         game: Array.isArray(data.game) ? data.game[0] : data.game,
//       }
//     : undefined;
// };
export const getReviewsByUser = async (id: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id,created_at,title,content,rating,likes,dislikes, comment_count ,platform,hours_played, profile:profiles(username,avatar),game:games(id,name,cover,slug)"
    )
    .eq("user_id", id);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = await Promise.all(
    data.map(async (review: any) => ({
      ...review,
      profile: review.profile,
      game: review.game,
      tags: await getPostTags("review", review.id),
    }))
  );

  return mappedData;
};

export const createReview = async (
  title: string,
  content: string,
  rating: number,
  game_id: number,
  user_id: string,
  platform: string,
  hours_played: number,
  tags: string[] // array of names or slugs
) => {
  // Step 1: Insert review
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .insert({
      title,
      content,
      rating,
      game_id,
      user_id,
      platform,
      hours_played,
    })
    .select()
    .single(); // return just one row

  if (reviewError) throw reviewError;

  // Step 2: get tag ids

  const tagRows = await getTagsByName(tags);

  // if (tagError) throw tagError;

  // Step 3: Insert join records
  const tagLinks = tagRows.map((tag) => ({
    parent_type: "review",
    parent_id: review.id,
    tag_id: tag.id,
  }));

  const { error: linkError } = await supabase
    .from("tag_links")
    .insert(tagLinks);

  if (linkError) throw linkError;

  return { ...review, tags: tagRows };
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
