"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createDiscussion } from "../api/supabase-api/discussion-api";
import { useParams } from "next/navigation";
import AuthModal from "./AuthModal";
import { useAuth } from "../auth/auth-context";
import TagSection from "./TagSection";
import MarkdownText from "./MarkdownText";
const CreateDiscussion: React.FC<{ ctaType?: "input" | "button" }> = ({
  ctaType = "input",
}) => {
  const [showAuth, setShowAuth] = useState(false);

  const pathname = usePathname();
  console.log(pathname);
  // Extract current category from pathname
  const currentSource =
    ["game", "tag"].find((route) => pathname.includes(`/${route}`)) || "all";

  console.log("current source", currentSource);
  let recommendedTags: string[] = [];

  // get recommended tags based on route
  if (currentSource === "game") {
    const { slug } = useParams<{ slug: string }>();
    recommendedTags.push(slug);
  }
  if (currentSource == "tag") {
    const { tag } = useParams<{ tag: string }>();
    recommendedTags.push(tag);
  }

  // const recommendedTags: string[] = slug ? [slug] : [];
  const [tags, setTags] = useState<string[]>(recommendedTags);
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

  const openModal = () => {
    if (!session) {
      setShowAuth(true);
      return;
    }
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
      {ctaType == "input" ? (
        <button className="input border-amber-100" onClick={openModal}>
          What's on your mind?
        </button>
      ) : (
        <button type="button" onClick={openModal} className="btn btn-primary">
          Start a Discussion
        </button>
      )}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

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
                placeholder="What's this post about?"
              />
              <label className="label">Content</label>
              {/* <textarea
                className="textarea"
                placeholder="What's on your mind?"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                required
              /> */}
              <MarkdownText text={content} setText={setContent} />

              <TagSection
                // canSearchGame={true}
                recommendedTags={recommendedTags}
                tags={tags}
                setTags={setTags}
              />
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
