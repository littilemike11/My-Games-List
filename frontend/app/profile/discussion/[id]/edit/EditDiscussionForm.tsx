"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import TagSection from "@/app/components/TagSection";
import { updateDiscussionAction } from "./actions";
import { updateDiscussion } from "@/app/api/supabase-api/discussion-api";
import { useRouter } from "next/navigation";
// import { redirect } from "next/navigation";
export default function EditDiscussionForm({
  //   updateDiscussion,
  userId,
  username,
  discussionId,
  initialTitle,
  initialContent,
  initialTags,
  initialTagIds,
}: {
  //   updateDiscussion: (formData: FormData) => void;
  userId: string;
  username: string;
  discussionId: number;
  initialTitle: string;
  initialContent: string;
  initialTags: string[];
  initialTagIds: number[];
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  //   const initialState = {
  //     message: "",
  //   };
  //   const [state, formAction, pending] = useActionState(
  //     updateDiscussionAction,
  //     initialState
  //   );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🚫 stop page refresh

    setUpdating(true);
    try {
      if (!title || !content) return;
      const result = await updateDiscussion(
        discussionId,
        userId,
        initialTagIds,
        tags,
        { title, content }
      );

      console.log("Created discussion:", result);
      if (result) {
        setUpdating(false);
        router.push(`/user/${username}/discussion/${discussionId}`);
      }
      // maybe close modal or reset form here
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setUpdating(false);
    }
  };

  //   const handleSubmit = async (formData: FormData) => {
  //     setUpdating(true);
  //     const result = await updateDiscussion(formData);
  //     setUpdating(false);

  //     if (result) {
  //       redirect(`/discussions/${discussionId}`);
  //     }
  //   };

  //   return (
  //     <form action={formAction} className="max-w-3xl mx-auto mt-8">
  //       <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
  //         <legend className="font-bold text-xl">Edit Discussion</legend>
  //         <input type="hidden" name="id" value={discussionId} />

  //         <label className="label">Title</label>
  //         <input
  //           name="title"
  //           className="input"
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //           required
  //         />

  //         <label className="label">Content</label>
  //         <textarea
  //           name="content"
  //           className="textarea"
  //           value={content}
  //           onChange={(e) => setContent(e.target.value)}
  //           required
  //         />

  //         <input type="hidden" name="tags" value={JSON.stringify(tags)} />
  //         <input
  //           type="hidden"
  //           name="oldTagIds"
  //           value={JSON.stringify(initialTagIds)}
  //         />

  //         <TagSection tags={tags} setTags={setTags} recommendedTags={[]} />
  //       </fieldset>

  //       <button
  //         type="submit"
  //         className="btn btn-success mt-4"
  //         aria-disabled={pending}
  //       >
  //         {pending ? "Updating..." : "Save Changes"}
  //       </button>
  //     </form>
  //   );
  return (
    <>
      <div>
        <form className="max-w-3xl mx-auto my-8" onSubmit={handleSubmit}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend font-bold text-xl">
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
            <textarea
              className="textarea"
              placeholder="What's on your mind?"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              required
            />
            <TagSection
              // canSearchGame={true}
              recommendedTags={[]}
              tags={tags}
              setTags={setTags}
            />
          </fieldset>
          <div className="modal-action flex justify-between w-full">
            <button
              type="submit"
              className="btn btn-success"
              aria-disabled={updating}
            >
              {updating ? "Updating ..." : "Save"}
            </button>
            <Link className="btn btn-error" href={"/popular/discussions"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
