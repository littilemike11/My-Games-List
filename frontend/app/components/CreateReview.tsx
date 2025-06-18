"use client";
import { Game } from "../types/models";
import { FaSquarePen } from "react-icons/fa6";
import { useState } from "react";
import RatingInput from "./RatingInput";
type ReviewProps = {
  game: Game;
};

const CreateReview: React.FC<ReviewProps> = ({ game }) => {
  const [title, setTitle] = useState(`${game.name}'s Review`);
  const [platform, setPlatform] = useState("");
  const [hoursPlayed, setHoursPlayed] = useState("");
  const [summary, setSummary] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    const newReview = {
      gameID: game.id,
      title: title,
      platform: platform,
      hoursPlayed: hoursPlayed,
      text: summary,
      rating: rating,
    };

    console.log(newReview);
  };
  const openModal = () => {
    const modal = document.getElementById(
      "my_modal_5"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };
  const closeModal = () => {
    const modal = document.getElementById(
      "my_modal_5"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

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
                {game.name}'s Review
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
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                defaultValue={"Pick a Platform"}
                className="select"
              >
                <option value={"Pick a Platform"} disabled={true}>
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
                onChange={(e) => setHoursPlayed(e.target.value)}
              />
              <label className="label">Summary</label>
              <textarea
                className="textarea"
                placeholder="What are your thoughts? Pros and Cons?"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <label>Rating</label>
              <RatingInput />
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
