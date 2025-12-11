import { notFound } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import EditListForm from "./EditListForm";
import { getUserGames, getOwnListByID } from "@/app/api/supabase-api/list-api";
import { List, Tag } from "@/app/types/models";

import Custom404 from "@/app/components/Custom404";
export default async function EditListPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Custom404 title="You must be logged in to edit this post." />;
  }
  const listID = Number(params.id);

  if (isNaN(listID)) return notFound();

  // fetch List
  const oldList: List | null = await getOwnListByID(listID, user.id);
  if (!oldList) {
    return notFound();
  }

  // Ownership check — server enforced redundanct from getownlistbyid check
  if (oldList.profile.id !== user.id) {
    return <Custom404 title="You are not allowed to edit this list." />;
  }

  // fetch user games
  const userGames = await getUserGames(user.id);

  return (
    <>
      <EditListForm
        userGames={userGames}
        userID={user.id}
        // username={oldList.profile.username}
        listID={listID}
        initialTitle={oldList.title}
        initialDescription={oldList.description ?? ""}
        initialTags={oldList.tags?.map((t: Tag) => t.name) ?? []}
        initialTagIds={oldList.tags?.map((t: Tag) => t.id) ?? []}
        initialGames={oldList.games}
      />
    </>
  );
}
