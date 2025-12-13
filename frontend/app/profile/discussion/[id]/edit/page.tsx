// "use client";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import {
//   getOwnDiscussionByID,
//   updateDiscussion,
// } from "@/app/api/supabase-api/discussion-api";
// import { useAuth } from "@/app/auth/auth-context";
// import TagSection from "@/app/components/TagSection";
// import { Discussion } from "@/app/types/models";
// import Custom404 from "@/app/components/Custom404";
// const CreateDiscussion = () => {
//   const [tags, setTags] = useState<string[]>([]);
//   const [oldTagIds, setOldTagIds] = useState<number[]>([]);
//   const { session } = useAuth();
//   const [loading, setloading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   const userID = session?.user.id;
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const { id } = useParams<{ id: string }>();
//   const [discussion, setDiscussion] = useState<Discussion | null>();

//   const fetchDiscussion = async (id: number) => {
//     try {
//       if (!userID) return;
//       const response = await getOwnDiscussionByID(userID, id);
//       console.log(response);
//       if (!response) {
//         setloading(false);
//         return;
//       }
//       setDiscussion(response);

//       setTitle(response?.title);
//       setContent(response?.content);
//       setTags(response?.tags?.flatMap((tag) => tag.name) ?? []);
//       console.log(response?.tags);
//       setOldTagIds(response?.tags?.flatMap((tag) => tag.id) ?? []);
//       //   setDiscussion(response);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setloading(false);
//     }
//   };
//   useEffect(() => {
//     fetchDiscussion(+id); // convert id to number
//   }, [userID]);
//   const handleSubmit = async () => {
//     setUpdating(true);
//     try {
//       if (!title || !content || !session) return;
//       const result = await updateDiscussion(
//         +id,
//         session.user.id,
//         oldTagIds,
//         tags,
//         { title, content }
//       );

//       console.log("Created discussion:", result);
//       // maybe close modal or reset form here
//     } catch (error) {
//       console.error("Error in handleSubmit:", error);
//       alert("Something went wrong. Check console for details.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <div className="flex w-96 flex-col gap-4">
//           <div className="flex items-center gap-4">
//             <div className="skeleton h-16 w-16 shrink-0"></div>
//             <div className="flex flex-col gap-4">
//               <div className="skeleton h-4 w-20"></div>
//               <div className="skeleton h-4 w-28"></div>
//             </div>
//           </div>
//           <div className="skeleton h-48 w-full"></div>
//         </div>
//       </>
//     );
//   } else if (userID && !loading) {
//     return (
//       <>
//         <div>
//           <div>
//             <form onSubmit={handleSubmit}>
//               <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
//                 <legend className="fieldset-legend font-bold text-xl">
//                   What's on your mind?
//                 </legend>

//                 <label className="label">Post Title</label>
//                 <input
//                   onChange={(e) => setTitle(e.target.value)}
//                   type="text"
//                   className="input"
//                   value={title}
//                   required
//                   autoFocus
//                   placeholder="What's this post about?"
//                 />
//                 <label className="label">Content</label>
//                 <textarea
//                   className="textarea"
//                   placeholder="What's on your mind?"
//                   onChange={(e) => setContent(e.target.value)}
//                   value={content}
//                   required
//                 />
//                 <TagSection
//                   // canSearchGame={true}
//                   recommendedTags={[]}
//                   tags={tags}
//                   setTags={setTags}
//                 />
//               </fieldset>
//               <div className="modal-action flex justify-between w-full">
//                 <button type="submit" className="btn btn-success">
//                   Post
//                 </button>
//                 <Link className="btn btn-error" href={"/popular/discussions"}>
//                   Cancel
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </>
//     );
//   } else {
//     return (
//       <>
//         <Custom404 title="404 | Discussion not Found" />
//       </>
//     );
//   }
// };

// export default CreateDiscussion;

import { notFound } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import { getOwnDiscussionByID } from "@/app/api/supabase-api/discussion-api";

import EditDiscussionForm from "@/app/profile/discussion/[id]/edit/EditDiscussionForm";
import Custom404 from "@/app/components/Custom404";
import { Discussion, Tag } from "@/app/types/models";
// import Custom403 from "@/app/components/Custom403";

export default async function EditDiscussionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Custom404 title="You must be logged in to edit this post." />;
  }

  const discussionId = Number(id);

  if (isNaN(discussionId)) return notFound();

  // Fetch discussion
  const discussion: Discussion | null = await getOwnDiscussionByID(
    user.id,
    discussionId
  );

  if (!discussion) {
    return notFound();
  }

  // Ownership check — server enforced redundanct from getowndiscussionbyid check
  if (discussion.profile.id !== user.id) {
    return <Custom404 title="You are not allowed to edit this discussion." />;
  }

  return (
    <EditDiscussionForm
      //   updateDiscussion={updateDiscussion}
      userId={user.id}
      username={discussion.profile.username}
      discussionId={discussionId}
      initialTitle={discussion.title}
      initialContent={discussion.content}
      initialTags={discussion.tags?.map((t: Tag) => t.name) ?? []}
      initialTagIds={discussion.tags?.map((t: Tag) => t.id) ?? []}
    />
  );
}
