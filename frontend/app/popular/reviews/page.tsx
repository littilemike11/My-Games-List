import Tabs from "@/app/components/Tabs";
import ReviewItem from "@/app/components/ReviewItem";
import { Review } from "@/app/types/models";
import { getReviews } from "@/app/api/supabase-api/review-api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews", // no need to include site name because global template handles it
  description: "Browse reviews from the gaming community on The Save Room.",

  openGraph: {
    title: "Reviews",
    description: "Browse reviews from the gaming community.",
    url: "https://www.thesaveroom.co/popular/reviews",
    type: "website",
    // images: [
    //   {
    //     url: "/og-Reviews.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Reviews",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Reviews",
    description: "Browse reviews from the gaming community.",
    // images: ["/og-Reviews.png"],
  },

  robots: { index: true, follow: true },
};
export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const sort =
    (resolvedSearchParams.sort as "likes" | "comments" | "date") ?? "likes";

  const order = (resolvedSearchParams.order as "asc" | "desc") ?? "desc";

  const reviews: Review[] = await getReviews(50, sort, order);

  return (
    <>
      <div>
        <h1 className="text-4xl text-pretty text-center font-bold">Reviews</h1>
        <Tabs />
        <div className="flex flex-col space-y-10">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      </div>
    </>
  );
}
