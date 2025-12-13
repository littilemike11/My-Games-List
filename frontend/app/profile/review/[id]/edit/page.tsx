// "use client";
// import { Game, review } from "@/app/types/models";
// import { FaSquarePen } from "react-icons/fa6";
// import { useState, useEffect } from "react";
// import RatingInput from "@/app/components/RatingInput";
// import { useAuth } from "@/app/auth/auth-context";
// import { createReview } from "@/app/api/supabase-api/review-api";
// import { upsertGame } from "@/app/api/supabase-api/game-api";
// import TagSection from "@/app/components/TagSection";
// import { genres } from "@/app/mockData/genreTags";
// import { themes } from "@/app/mockData/themeTags";
// type reviewProps = {
//   game: Game;
// };
// // issues with modal appearing on conditionally rendered cta
// // 1 Solution have review on new - /game/slug/review
// const CreateReview: React.FC<ReviewProps> = ({ game }) => {
//   const { session, profile, loading } = useAuth();
//   const [title, setTitle] = useState("");
//   const [platform, setPlatform] = useState("");
//   const [hoursPlayed, setHoursPlayed] = useState(0);
//   const [summary, setSummary] = useState("");
//   const [rating, setRating] = useState(0);
//   const recommendedTags = [game.slug]
//     .concat(game.genres.map((g) => genres[g]))
//     .concat(game.themes.map((t) => themes[t]));

//   console.log(recommendedTags);
//   const [tags, setTags] = useState<string[]>(recommendedTags ?? []);

//   const handleSubmit = async () => {
//     try {
//       if (!title || !summary || !session) return;

//       //  First: Ensure game exists in Supabase

//       const result = await createReview(
//         title,
//         summary,
//         rating,
//         newGame.id,
//         session.user.id,
//         platform,
//         hoursPlayed,
//         tags
//       );

//       console.log("Created review:", result);
//       console.log("Game added (or existed):", newGame);

//       // Optionally reset form or close modal
//       // closeModal();
//       resetForm();
//     } catch (error) {
//       console.error("Error in handleSubmit:", error);
//       alert("Something went wrong. Check console for details.");
//     }
//   };
//   const resetForm = () => {
//     setTitle(`${profile?.username}'s review of ${game.name}` || "");
//     setPlatform("");
//     setHoursPlayed(0);
//     setSummary("");
//     setRating(0);
//   };

//   const openModal = () => {
//     const modal = document.getElementById(
//       "my_modal_5"
//     ) as HTMLDialogElement | null;
//     modal?.showModal();
//   };
//   const closeModal = () => {
//     resetForm();
//     const modal = document.getElementById(
//       "my_modal_5"
//     ) as HTMLDialogElement | null;
//     modal?.close();
//   };
//   useEffect(() => {
//     if (profile) {
//       setTitle(`${profile?.username}'s review of ${game.name}`);
//     }
//   }, [profile]);

//   // useEffect(() => {
//   //   const fetchTags = async () => {
//   //     const response = await getTagByName(recommendedTags);
//   //     console.log("tags", response);
//   //   };
//   //   fetchTags();
//   // }, []);

//   return (
//     <>
//       <button className="btn btn-primary btn-sm md:btn-md " onClick={openModal}>
//         <FaSquarePen />
//         Write a review
//       </button>

//       <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
//         <div className="modal-box">
//           <form onSubmit={handleSubmit}>
//             <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
//               <legend className="fieldset-legend font-bold text-lg">
//                 {title}
//               </legend>
//               <label className="label">Title</label>
//               <input
//                 type="text"
//                 className="input"
//                 placeholder="Review Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//               <label className="label">Platform Played</label>
//               <select
//                 required
//                 value={platform}
//                 onChange={(e) => setPlatform(e.target.value)}
//                 className="select"
//               >
//                 <option hidden value={""} disabled={true}>
//                   Pick a Platform
//                 </option>
//                 {game.platforms.map((platform, index) => (
//                   <option key={index} value={platform}>
//                     {platform}
//                   </option>
//                 ))}
//               </select>
//               <label className="label">~ Hours Played</label>
//               <input
//                 type="number"
//                 className="input validator"
//                 required
//                 placeholder="Must have played"
//                 min={1}
//                 title="must be greater than 0 hrs"
//                 value={hoursPlayed}
//                 onChange={(e) => setHoursPlayed(Number(e.target.value))}
//               />
//               <label className="label">Summary</label>
//               <textarea
//                 className="textarea"
//                 placeholder="What are your thoughts? Pros and Cons?"
//                 value={summary}
//                 onChange={(e) => setSummary(e.target.value)}
//               />
//               <label>Rating</label>
//               <RatingInput value={rating} onChange={setRating} />
//               <TagSection
//                 recommendedTags={recommendedTags}
//                 tags={tags}
//                 setTags={setTags}
//               />
//             </fieldset>
//             <div className="modal-action flex justify-between w-full">
//               <button type="submit" className="btn btn-success">
//                 Post
//               </button>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="btn btn-error"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </dialog>

//       {/* Optional: Keep this outside if it's a separate preview or info form */}
//     </>
//   );
// };

// export default CreateReview;

import { notFound } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";

import EditReviewForm from "@/app/profile/review/[id]/edit/EditReviewForm";
import Custom404 from "@/app/components/Custom404";
import { Review, Tag } from "@/app/types/models";
import { getOwnReviewByID } from "@/app/api/supabase-api/review-api";
// import Custom403 from "@/app/components/Custom403";

export default async function EditReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Custom404 title="You must be logged in to edit this post." />;
  }

  const reviewId = Number(params.id);

  if (isNaN(reviewId)) return notFound();

  // Fetch review
  const review: Review | null = await getOwnReviewByID(user.id, reviewId);

  if (!review) {
    return notFound();
  }

  // Ownership check — server enforced redundanct from getownReviewbyid check
  if (review.profile.id !== user.id) {
    return <Custom404 title="You are not allowed to edit this review." />;
  }

  return (
    <EditReviewForm
      //   updateReview={updateReview}
      userId={user.id}
      username={review.profile.username}
      game={review.game}
      reviewId={reviewId}
      initialTitle={review.title}
      initialContent={review.content}
      initialRating={review.rating}
      initialPlatform={review.platform}
      initialHours_played={review.hours_played}
      initialTags={review.tags?.map((t: Tag) => t.name) ?? []}
      initialTagIds={review.tags?.map((t: Tag) => t.id) ?? []}
    />
  );
}
