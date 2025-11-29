"use client";
import ReviewItem from "@/app/components/ReviewItem";
import { useParams, usePathname } from "next/navigation";
import { getReviewByID } from "@/app/api/supabase-api/review-api";
import { useEffect, useState } from "react";
import { Review } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
const ReviewPage = () => {
  const { name, id } = useParams<{ name: string; id: string }>();
  const [review, setReview] = useState<Review | null>();

  const fetchReview = async (id: number) => {
    try {
      const response = await getReviewByID(id);
      console.log(response);
      setReview(response);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchReview(+id); // convert id to number
  }, []);

  return (
    <>
      {review ? (
        <div>
          <ReviewItem review={review} />
          {/* comments of review */}
          <CommentSection parentType={"review"} parentID={+id} />
        </div>
      ) : (
        <p className="text-lg text-error">Review doesn't exist</p>
      )}
    </>
  );
};

export default ReviewPage;
