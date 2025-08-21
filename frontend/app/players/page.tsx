import { getPlayers } from "../api/supabase-api/profile-api";
import { ProfileItem } from "../components/ProfileItem";
export default async function PlayersPage() {
  const players = await getPlayers();

  console.log(players);
  return (
    <>
      <div className="mx-4 sm:mx-[2rem]">
        <h1 className="text-3xl mb-4">Players</h1>
        {players.map((player) => (
          <ProfileItem key={player.id} profile={player} />
        ))}
      </div>
    </>
  );
}
