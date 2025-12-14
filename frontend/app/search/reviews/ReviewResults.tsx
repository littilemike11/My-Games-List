"use client";
import ReviewItem from "@/app/components/ReviewItem";
import { Review } from "@/app/types/models";

export default function ReviewResults({
  query,
  reviews,
}: {
  query: string;
  reviews: Review[];
}) {
  return (
    <>
      <main className="p-6 max-w-4xl mx-auto">
        {/* This could be a component that fetches & combines results */}

        <section>
          <div className="space-y-6">
            {/* Title */}
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold mb-2">
                Reviews matching <span className="text-primary">"{query}"</span>
              </h1>
              <p className="text-sm text-gray-500">
                {reviews.length} result{reviews.length !== 1 && "s"} found
              </p>
            </div>

            {/* Map your results here */}
            {/* <p>Reviews matching </p> */}
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-error text-center mt-10 text-lg">
                No Reviews found
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
