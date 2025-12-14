// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { searchReviews } from "@/app/api/supabase-api/review-api";
// import ReviewItem from "@/app/components/ReviewItem";
// import { Review } from "@/app/types/models";
// const ReviewResultsPage = () => {
//   const searchParams = useSearchParams();
//   const [reviews, setReviews] = useState<Review[]>([]);

//   const query = searchParams
//     .get("q")
//     ?.trim()
//     .toLowerCase()
//     .replace(/[\s+/]+/g, "-") // turn spaces, +, / into -
//     .replace(/-+/g, "-"); // collapse multiple - into one

//   useEffect(() => {
//     const fetchReviews = async () => {
//       if (!query) return;
//       try {
//         const response = await searchReviews(query);
//         setReviews(response);
//       } catch (error) {
//         console.error(`error fetching Reviews with ${query}`, error);
//       }
//     };
//     fetchReviews();
//   }, [query]);
//   return (
//     <>
//       <main className="p-6 max-w-4xl mx-auto">
//         {/* This could be a component that fetches & combines results */}

//         <section>
//           <div className="space-y-6">
//             {/* Title */}
//             <div className="border-b pb-4">
//               <h1 className="text-3xl font-bold mb-2">
//                 Reviews matching <span className="text-primary">"{query}"</span>
//               </h1>
//               <p className="text-sm text-gray-500">
//                 {reviews.length} result{reviews.length !== 1 && "s"} found
//               </p>
//             </div>

//             {/* Map your results here */}
//             {/* <p>Reviews matching </p> */}
//             {reviews.length > 0 ? (
//               <div className="flex flex-col gap-4">
//                 {reviews.map((review) => (
//                   <ReviewItem key={review.id} review={review} />
//                 ))}
//               </div>
//             ) : (
//               <p className="text-error text-center mt-10 text-lg">
//                 No Reviews found
//               </p>
//             )}
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };
// export default ReviewResultsPage;

import { notFound } from "next/navigation";
import { searchReviews } from "@/app/api/supabase-api/review-api";
import ReviewResults from "./ReviewResults";

export default async function ReviewsSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  if (!query) notFound();

  const reviews = await searchReviews(query);

  return <ReviewResults query={query} reviews={reviews} />;
}
