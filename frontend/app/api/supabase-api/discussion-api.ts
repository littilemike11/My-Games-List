import supabase from "@/supabase-client";

export const getDiscussions = async () => {
  const { data, error } = await supabase.from("discussions").select("*");
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  return data;
};

export const createDiscussion = async ({
  title,
  content,
  tags,
}: {
  title: string;
  content: string;
  tags: string[];
}) => {
  const { data, error } = await supabase
    .from("discussions")
    .insert([{ title, content, tags }]);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  return data;
};
