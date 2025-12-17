import Tabs from "@/app/components/Tabs";
import { getPlayers } from "@/app/api/supabase-api/profile-api";
import { ProfileItem } from "@/app/components/ProfileItem";
export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>;
}) {
  // const { sort = "level", order = "desc" } = await searchParams;
  const resolvedSearchParams = await searchParams;

  const sort =
    (resolvedSearchParams.sort as "level" | "followers" | "name") ?? "level";

  const order = (resolvedSearchParams.order as "asc" | "desc") ?? "desc";
  const players = await getPlayers(50, sort, order);

  return (
    <>
      <div className="pb-6">
        <h1 className="text-4xl text-pretty text-center font-bold">Players</h1>
        <Tabs />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 place-items-center md:grid-cols-4 gap-6 ">
          {players.map((player) => (
            <ProfileItem
              key={player.id}
              profile={player}
              // featureList={userList}
            />
          ))}
        </div>
      </div>
    </>
  );
}
