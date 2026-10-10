"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createDiscussion } from "../api/supabase-api/discussion-api";
import { useParams } from "next/navigation";
import AuthModal from "./AuthModal";
import { useAuth } from "../auth/auth-context";
import TagSection from "./TagSection";
import MarkdownText from "./MarkdownText";
import { FaBug, FaCommentMedical } from "react-icons/fa";
const CreateDiscussion: React.FC<{
  ctaType?: "input" | "game" | "bug" | "tag" | "feedback";
}> = ({ ctaType = "input" }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [initialTags, setInitialTags] = useState<string[]>([]);

  const pathname = usePathname();
  const modalId = `create-discussion-${ctaType}`;
  console.log(pathname);
  // Extract current category from pathname
  const params = useParams<{
    slug?: string;
    name?: string; // tag name
  }>();
  console.log("params", params);

  const { slug, name } = params;
  const managetags = () => {
    let recommendedTags: string[] = [];
    switch (ctaType) {
      case "game":
        slug && recommendedTags.push(slug);
        break;
      case "tag":
        name && recommendedTags.push(name);
        break;
      case "bug":
        recommendedTags.push("bug-report");
        break;
      case "feedback":
        recommendedTags.push("player-feedback");
        break;
      default:
        break;
    }
    setInitialTags(recommendedTags);
    return recommendedTags;
  };

  useEffect(() => {
    setTags(managetags());
  }, [ctaType, slug, name]);

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

  const openModal = () => {
    if (!session) {
      setShowAuth(true);
      return;
    }
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    modal?.showModal();
  };
  const closeModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
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
      ) : ctaType == "game" ? (
        <button
          type="button"
          onClick={openModal}
          className="btn w-fit btn-primary"
        >
          Start a Discussion
        </button>
      ) : ctaType == "bug" ? (
        <button onClick={openModal} className="flex text-error hover:link">
          Report a Bug <FaBug />
        </button>
      ) : ctaType == "tag" ? (
        <button className="input border-amber-100" onClick={openModal}>
          Thoughts on {params.name}?
        </button>
      ) : (
        // player feedback
        <button className="flex hover:link" onClick={openModal}>
          How can we improve? <FaCommentMedical />
        </button>
      )}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend font-bold text-lg">
                {/* What's on your mind? */}
                {ctaType == "game"
                  ? `${params.slug} Discussion`
                  : ctaType == "tag"
                    ? `${params.name} Discussion`
                    : ctaType == "bug"
                      ? "Bug Report"
                      : ctaType == "feedback"
                        ? "Player Feedback"
                        : //  input
                          "What's on your Mind"}
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
              <MarkdownText
                text={content}
                setText={setContent}
                // {...(ctaType == "bug" && {
                //   placeholderText:
                //     "Thank you for your diligence. Please inform us how and when this bug occurred! We will do our best to address it and solve it shortly.",
                // })}
                placeholderText={
                  ctaType == "bug"
                    ? "Thanks for reporting this issue. Please inform us how and when this bug occurred! We will do our best to address and solve it shortly."
                    : ctaType == "feedback"
                      ? "Tell us your ideas on how can we improve the Save Room!"
                      : "What's on your mind?"
                }
              />

              <TagSection
                // canSearchGame={true}
                recommendedTags={initialTags}
                lockedTags={initialTags}
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
