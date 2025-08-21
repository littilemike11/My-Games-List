"use client";
import { Game, Review } from "../types/models";
import { FaSquarePen } from "react-icons/fa6";
import { useState, useEffect } from "react";
import RatingInput from "./RatingInput";
import { useAuth } from "../auth/auth-context";
import { createReview } from "../api/supabase-api/review-api";
import { upsertGame } from "../api/supabase-api/game-api";
type ReviewProps = {
  game: Game;
};
// issues with modal appearing on conditionally rendered cta
// 1 Solution have review on new - /game/slug/review
const CreateReview: React.FC<ReviewProps> = ({ game }) => {
  const { session, profile, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [hoursPlayed, setHoursPlayed] = useState(0);
  const [summary, setSummary] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    try {
      if (!title || !summary || !session) return;

      //  First: Ensure game exists in Supabase
      const newGame = await upsertGame(game);
      if (!newGame) throw new Error("Failed to upsert game");

      //  Then: Create review with correct gameID
      const newReview: Review = {
        user_id: session.user.id,
        game_id: newGame.id, // use the ID from Supabase, not from IGDB
        title: title,
        platform: platform,
        hours_played: hoursPlayed,
        content: summary,
        rating: rating,
      };
      console.log("Review to submit:", newReview);
      console.log("Game in DB:", newGame);

      const result = await createReview(newReview);

      console.log("Created review:", result);
      console.log("Game added (or existed):", newGame);

      // Optionally reset form or close modal
      // closeModal();
      resetForm();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Something went wrong. Check console for details.");
    }
  };
  const resetForm = () => {
    setTitle(`${profile?.username}'s Review of ${game.name}` || "");
    setPlatform("");
    setHoursPlayed(0);
    setSummary("");
    setRating(0);
  };

  const openModal = () => {
    const modal = document.getElementById(
      "my_modal_5"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };
  const closeModal = () => {
    resetForm();
    const modal = document.getElementById(
      "my_modal_5"
    ) as HTMLDialogElement | null;
    modal?.close();
  };
  useEffect(() => {
    if (profile) {
      setTitle(`${profile?.username}'s Review of ${game.name}`);
    }
  }, [profile]);

  return (
    <>
      <button className="btn btn-primary w-max btn-lg" onClick={openModal}>
        <FaSquarePen />
        Write a Review
      </button>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend font-bold text-lg">
                {title}
              </legend>
              <label className="label">Title</label>
              <input
                type="text"
                className="input"
                placeholder="Review Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label className="label">Platform Played</label>
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
              </select>
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
              <textarea
                className="textarea"
                placeholder="What are your thoughts? Pros and Cons?"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <label>Rating</label>
              <RatingInput value={rating} onChange={setRating} />
            </fieldset>
            <div className="modal-action flex justify-between w-full">
              <button type="submit" className="btn btn-success">
                Post
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-error"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Optional: Keep this outside if it's a separate preview or info form */}
    </>
  );
};

export default CreateReview;
