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
  user_id,
  title,
  content,
  tags,
}: {
  user_id: string;
  title: string;
  content: string;
  tags: string[];
}) => {
  const { data, error } = await supabase
    .from("discussions")
    .insert([{ user_id, title, content, tags }]);
  if (error) {
    console.log("Error Inserting: ", error);
    throw error;
  }
  return data;
};

//user cant change user id or ownership
export const updateDiscussion = async (
  id: number,
  updates: {
    title: string;
    content: string;
    tags: string[];
  }
) => {
  const { data, error } = await supabase
    .from("discussions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Error Updating discussion", error);
    throw error;
  }
  return data;
};

export const deleteDiscussion = async (id: number) => {
  const { data, error } = await supabase
    .from("discussions")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error deleting discussion", error);
    throw error;
  }
  return data;
};
