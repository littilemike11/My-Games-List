import Tabs from "@/app/components/Tabs";
import { getPlayers } from "@/app/api/supabase-api/profile-api";
import { ProfileItem } from "@/app/components/ProfileItem";
export default async function PlayersPage() {
  const players = await getPlayers(50);

  return (
    <>
      <div>
        <h1 className="text-4xl text-pretty text-center font-bold">Players</h1>
        <Tabs />
        <div className="flex flex-col items-center">
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
