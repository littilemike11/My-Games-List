import supabase from "@/supabase-client";

export const getReviews = async () => {
  const { data, error } = await supabase.from("reviews").select("*");
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  return data;
};
