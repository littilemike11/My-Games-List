"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createDiscussion } from "@/app/api/supabase-api/discussion-api";
import { useAuth } from "@/app/auth/auth-context";
import { useRouter } from "next/navigation";
import MarkdownText from "@/app/components/MarkdownText";

import TagSection from "@/app/components/TagSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Discussion", // global template will append "| The Save Room"
  description: "What are your thoughts? Start a discussion on The Save Room.",

  robots: {
    index: false, // prevent search engines from indexing this utility page
    follow: false, // links inside don’t need to be followed
  },

  openGraph: {
    title: "Start a Discussion",
    description: "Start a new discussion.",
    type: "website",
    url: "https://www.thesaveroom.co/discussion/new",
    // images: [
    //   {
    //     url: "/og-create-discussion.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Create a discussion",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Start a Discussion",
    description: "Start a new discussion.",
    // images: ["/og-create-discussion.png"],
  },
};

const CreateDiscussion = () => {
  const [tags, setTags] = useState<string[]>([]);
  const { session, profile, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🚫 stop page refresh

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
      if (result) {
        router.push(`/discussion/${result.id}`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      {/* <button className="btn" onClick={openModal}>
        open modal
      </button> */}

      <div>
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
                recommendedTags={[]}
                tags={tags}
                setTags={setTags}
              />
            </fieldset>
            <div className="modal-action flex justify-between w-full">
              <button type="submit" className="btn btn-success">
                Post
              </button>
              <Link className="btn btn-error" href={"/popular/discussions"}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateDiscussion;
