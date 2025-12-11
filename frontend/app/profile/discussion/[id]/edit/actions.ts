"use server";
import { updateDiscussion } from "@/app/api/supabase-api/discussion-api";
import { redirect } from "next/navigation";
// ----- SERVER ACTION -----
export async function updateDiscussionAction(
  prevState: { message: string } | undefined,
  formData: FormData
): Promise<{ message: string } | undefined> {
  prevState = prevState ?? { message: "" }; // fallback if undefinedW

  console.log(formData);
  const { createClient } = await import("@/app/utils/supabase/server");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const discussionID = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tags = JSON.parse(formData.get("tags") as string);
  const oldTagIds = JSON.parse(formData.get("oldTagIds") as string);

  try {
    // Update discussion securely

    const response = await updateDiscussion(
      Number(discussionID),
      user.id,
      oldTagIds,
      tags,
      {
        title,
        content,
      }
    );
    console.log(response);
    if (response) redirect("/popular/discussions");
  } catch (error) {
    console.error(error);
    return { message: "failed to update" };
  }
}
