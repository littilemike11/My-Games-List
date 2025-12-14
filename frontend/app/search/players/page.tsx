// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { searchPlayers } from "@/app/api/supabase-api/profile-api";
// import { ProfileItem } from "@/app/components/ProfileItem";
// const PlayerResultsPage = () => {
//   const searchParams = useSearchParams();
//   const [players, setplayers] = useState<any[]>([]);

//   const query = searchParams
//     .get("q")
//     ?.trim()
//     .toLowerCase()
//     .replace(/[\s+/]+/g, "-") // turn spaces, +, / into -
//     .replace(/-+/g, "-"); // collapse multiple - into one

//   useEffect(() => {
//     const fetchplayers = async () => {
//       if (!query) return;
//       try {
//         const response = await searchPlayers(query);
//         setplayers(response);
//       } catch (error) {
//         console.error(`error fetching players with ${query}`, error);
//       }
//     };
//     fetchplayers();
//   }, [query]);
//   return (
//     <>
//       <main className="p-6 max-w-4xl mx-auto">
//         {/* This could be a component that fetches & combines results */}

//         <section>
//           {" "}
//           <div className="space-y-6">
//             {/* Title */}
//             <div className="border-b pb-4">
//               <h1 className="text-3xl font-bold mb-2">
//                 Players matching <span className="text-primary">"{query}"</span>
//               </h1>
//               <p className="text-sm text-gray-500">
//                 {players.length} result{players.length !== 1 && "s"} found
//               </p>
//             </div>

//             {/* Map your results here */}
//             {/* <p>players matching </p> */}
//             {players.length > 0 ? (
//               <div className="grid grid-cols-1 place-items-center md:grid-cols-2 gap-4">
//                 {players.map((player) => (
//                   <ProfileItem key={player.id} profile={player} />
//                 ))}
//               </div>
//             ) : (
//               <p className="text-error text-center mt-10 text-lg">
//                 No Players found
//               </p>
//             )}
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };
// export default PlayerResultsPage;
import { notFound } from "next/navigation";
import { searchPlayers } from "@/app/api/supabase-api/profile-api";
import PlayerResults from "./PlayerResults";
export default async function PlayersSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  if (!query) notFound();

  const players = await searchPlayers(query);

  return <PlayerResults query={query} players={players} />;
}
