import { notFound } from "next/navigation";
import { getListByID } from "@/app/api/supabase-api/list-api";
import { List } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
import Reactions from "@/app/components/Reactions";
import GamePreviewLink from "@/app/components/GamePreviewLink";
import TagItem from "@/app/components/TagItem";
import PostOptions from "@/app/components/PostOptions";
import Link from "next/link";
export default async function ListPage({ params }: { params: { id: string } }) {
  //   get list id
  const listID = Number(params.id);
  if (isNaN(listID)) return notFound();
  //   get list info
  const list: List | null = await getListByID(listID);
  if (!list) {
    return notFound();
  }

  return (
    <>
      <div className="flex flex-col gap-2 my-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-primary">{list.title}</h1>
          <PostOptions
            postType="list"
            postID={listID}
            ownerID={list.profile.id}
          />
        </div>
        <Link className="w-fit" href={`/user/${list.profile.username}`}>
          <p className="text-sm">
            Created by{" "}
            <span className="italic link link:hover">
              {list.profile.username}
            </span>
          </p>
        </Link>
        <p className="text-base"> {list.description}</p>
        <ul className="flex gap-2 ">
          {list.tags?.map((tag) => (
            <li key={tag.id}>
              <TagItem tag={tag} />
            </li>
          ))}
        </ul>
        <Reactions
          likeCount={list.likes}
          dislikeCount={list.dislikes}
          commentCount={list.comment_count}
          parent_id={list.id}
          parent_type="list"
        />
        <div className="bg-base-100 w-full p-2 overflow-auto flex gap-4 flex-wrap">
          {list.games.map((game) => (
            <div key={game.id} className="h-40">
              <GamePreviewLink
                game={{
                  id: game.id,
                  cover: game.cover,
                  name: game.name,
                  slug: game.slug,
                }}
              />
            </div>
          ))}
        </div>
        {/* comments of List */}
        <CommentSection parentType={"list"} parentID={listID} />
      </div>
    </>
  );
}
