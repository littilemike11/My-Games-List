import supabase from "@/supabase-client";

export const getDiscussions = async () => {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,tags,profile:profiles(username,avatar)"
    );
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = data.map((discussion: any) => ({
    ...discussion,
    profile: discussion.profile,
  }));

  return mappedData;
};

export const getDiscussionsByUser = async (id: string) => {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,tags,profile:profiles(username,avatar)"
    )
    .eq("user_id", id);
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  const mappedData = data.map((discussion: any) => ({
    ...discussion,
    profile: discussion.profile,
  }));

  return mappedData;
};

export const getDiscussionByID = async (discussionID: number) => {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      "id,created_at,title,content,likes,dislikes,comment_count,tags,profile:profiles(username,avatar)"
    )
    .eq("id", discussionID)
    .single();
  if (error) {
    console.log("Error fetching: ", error);
    throw error;
  }
  return data
    ? {
        ...data,
        profile: Array.isArray(data.profile) ? data.profile[0] : data.profile,
      }
    : undefined;
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
  user_id: string,
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
    .eq("user_id", user_id)
    .select()
    .single();
  if (error) {
    console.error("Error Updating discussion", error);
    throw error;
  }
  return data;
};

export const deleteDiscussion = async (id: number, user_id: string) => {
  const { data, error } = await supabase
    .from("discussions")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);
  if (error) {
    console.error("Error deleting discussion", error);
    throw error;
  }
  return data;
};
