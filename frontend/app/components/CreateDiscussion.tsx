"use client";
import { useState, useEffect } from "react";
import { createDiscussion } from "../api/supabase-api/discussion-api";
import AuthModal from "./AuthModal";
import { useAuth } from "../auth/auth-context";
import TagSection from "./TagSection";
const CreateDiscussion = () => {
  const [tags, setTags] = useState<string[]>([]);
  const { session, profile, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      if (!title || !content || !session) return;
      const result = await createDiscussion({
        user_id: session.user.id,
        title,
        content,
        tags,
      });

      console.log("Created discussion:", result);
      // maybe close modal or reset form here
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  useEffect(() => {
    if (profile) {
      setTitle(`${profile.username}'s Post`);
    }
  }, [profile]);

  const openModal = () => {
    if (!session) return;
    const modal = document.getElementById(
      "my_modal_4"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };
  const closeModal = () => {
    const modal = document.getElementById(
      "my_modal_4"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      {/* <button className="btn" onClick={openModal}>
        open modal
      </button> */}
      <input
        className="input border-amber-100"
        type="text"
        placeholder="What's on your mind?"
        onClick={openModal}
      />
      <dialog id="my_modal_4" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend font-bold text-lg">
                What's on your mind?
              </legend>

              <label className="label">Post Title</label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="input"
                value={title}
                required
                autoFocus
              />

              <textarea
                className="textarea"
                placeholder="What's on your mind?"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                required
              />
              <TagSection canSearchGame={true} />
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
    </>
  );
};

export default CreateDiscussion;
