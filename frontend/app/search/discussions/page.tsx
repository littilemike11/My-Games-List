// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { searchDiscussions } from "@/app/api/supabase-api/discussion-api";
// import { Discussion } from "@/app/types/models";
// import DiscussionItem from "@/app/components/DiscussionItem";
// const DiscussionResultsPage = () => {
//   const searchParams = useSearchParams();
//   const [discussions, setDiscussions] = useState<Discussion[]>([]);

//   const query = searchParams
//     .get("q")
//     ?.trim()
//     .toLowerCase()
//     .replace(/[\s+/]+/g, "-")
//     .replace(/-+/g, "-");

//   useEffect(() => {
//     const fetchDiscussions = async () => {
//       if (!query) return;
//       try {
//         const response = await searchDiscussions(query);
//         setDiscussions(response);
//       } catch (error) {
//         console.error(`error fetching discussions with ${query}`, error);
//       }
//     };
//     fetchDiscussions();
//   }, [query]);

//   return (
//     <main className="p-6 max-w-4xl mx-auto">
//       <section className="space-y-6">
//         {/* Title */}
//         <div className="border-b pb-4">
//           <h1 className="text-3xl font-bold mb-2">
//             Discussions matching <span className="text-primary">"{query}"</span>
//           </h1>
//           <p className="text-sm text-gray-500">
//             {discussions.length} result{discussions.length !== 1 && "s"} found
//           </p>
//         </div>

//         {/* Results */}
//         {discussions.length > 0 ? (
//           <div className="flex flex-col gap-4">
//             {discussions.map((discussion) => (
//               <DiscussionItem key={discussion.id} discussion={discussion} />
//             ))}
//           </div>
//         ) : (
//           <p className="text-error text-center mt-10 text-lg">
//             No discussions found for "{query}"
//           </p>
//         )}
//       </section>
//     </main>
//   );
// };

// export default DiscussionResultsPage;

import { notFound } from "next/navigation";
import { searchDiscussions } from "@/app/api/supabase-api/discussion-api";
import DiscussionResults from "./DiscussionResults";

export default async function DiscussionsSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  if (!query) notFound();

  const discussions = await searchDiscussions(query);

  return <DiscussionResults query={query} discussions={discussions} />;
}
