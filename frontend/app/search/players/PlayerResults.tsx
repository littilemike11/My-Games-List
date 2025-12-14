import { ProfileItem } from "@/app/components/ProfileItem";
import { Profile } from "@/app/types/models";

export default function PlayerResults({
  query,
  players,
}: {
  query: string;
  players: Profile[];
}) {
  return (
    <>
      <main className="p-6 max-w-4xl mx-auto">
        {/* This could be a component that fetches & combines results */}

        <section>
          {" "}
          <div className="space-y-6">
            {/* Title */}
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold mb-2">
                Players matching <span className="text-primary">"{query}"</span>
              </h1>
              <p className="text-sm text-gray-500">
                {players.length} result{players.length !== 1 && "s"} found
              </p>
            </div>

            {/* Map your results here */}
            {/* <p>players matching </p> */}
            {players.length > 0 ? (
              <div className="grid grid-cols-1 place-items-center md:grid-cols-2 gap-4">
                {players.map((player) => (
                  <ProfileItem key={player.id} profile={player} />
                ))}
              </div>
            ) : (
              <p className="text-error text-center mt-10 text-lg">
                No Players found
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
