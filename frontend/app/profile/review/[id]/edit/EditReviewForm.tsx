"use client";
import Link from "next/link";
import { useState } from "react";
import TagSection from "@/app/components/TagSection";
import { updateReview } from "@/app/api/supabase-api/review-api";
import { useRouter } from "next/navigation";
import RatingInput from "@/app/components/RatingInput";
import GamePreviewLink from "@/app/components/GamePreviewLink";
import { GamePreview } from "@/app/types/models";
import MarkdownText from "@/app/components/MarkdownText";
// import { redirect } from "next/navigation";
export default function EditReviewForm({
  //   updateReview,
  userId,
  username,
  game,
  reviewId,
  initialTitle,
  initialContent,
  initialTags,
  initialTagIds,
  initialRating,
  initialPlatform,
  initialHours_played,
}: {
  //   updateReview: (formData: FormData) => void;
  userId: string;
  username: string;
  game: GamePreview;
  reviewId: number;
  initialTitle: string;
  initialContent: string;
  initialTags: string[];
  initialTagIds: number[];
  initialRating: number;
  initialPlatform: string;
  initialHours_played: number;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [updating, setUpdating] = useState(false);
  const [platform, setPlatform] = useState(initialPlatform);
  const [hoursPlayed, setHoursPlayed] = useState(initialHours_played);
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🚫 stop page refresh

    setUpdating(true);
    try {
      if (!title || !content) return;
      const result = await updateReview(reviewId, userId, initialTagIds, tags, {
        // game_id: game.id,
        title,
        content,
        rating,
        platform,
        hours_played: hoursPlayed,
      });

      console.log("Created Review:", result);
      if (result) {
        setUpdating(false);
        router.push(`/review/${reviewId}`);
      }
      // maybe close modal or reset form here
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div>
        <form className="max-w-3xl mx-auto my-8" onSubmit={handleSubmit}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend font-bold text-lg">
              Edit Review
            </legend>
            <div className="w-28">
              <GamePreviewLink game={game} />
            </div>
            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              placeholder="Review Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* <label className="label">Platform Played</label>
            <select
              required
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="select"
            >
              <option hidden value={""} disabled={true}>
                Pick a Platform
              </option>
              {game.platforms.map((platform, index) => (
                <option key={index} value={platform}>
                  {platform}
                </option>
              ))} 
            </select>*/}
            <label className="label">~ Hours Played</label>
            <input
              type="number"
              className="input validator"
              required
              placeholder="Must have played"
              min={1}
              title="must be greater than 0 hrs"
              value={hoursPlayed}
              onChange={(e) => setHoursPlayed(Number(e.target.value))}
            />
            <label className="label">Summary</label>
            <MarkdownText text={content} setText={setContent} />

            <label>Rating</label>
            <RatingInput value={rating} onChange={setRating} />
            <TagSection recommendedTags={[]} tags={tags} setTags={setTags} />
          </fieldset>
          <div className="modal-action flex justify-between w-full">
            <button
              type="submit"
              className="btn btn-success"
              aria-disabled={updating}
            >
              {updating ? "Updating ..." : "Save"}
            </button>
            <Link className="btn btn-error" href={"/popular/reviews"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
