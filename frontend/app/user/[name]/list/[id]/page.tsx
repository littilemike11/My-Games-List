"use client";
import ListItem from "@/app/components/ListItem";
import { useParams, usePathname } from "next/navigation";
import { getListByID } from "@/app/api/supabase-api/list-api";
import { useEffect, useState } from "react";
import { List } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
import Reactions from "@/app/components/Reactions";
import GamePreviewLink from "@/app/components/GamePreviewLink";
import TagItem from "@/app/components/TagItem";
const ListPage = () => {
  const { name, id } = useParams<{ name: string; id: string }>();
  const [list, setList] = useState<List | null>();

  const fetchList = async (id: number) => {
    try {
      const response = await getListByID(id);
      console.log(response);
      setList(response);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchList(+id); // convert id to number
  }, []);

  return (
    <>
      {/* {List && <ListItem List={List} />} */}
      {list ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-primary">{list.title}</h2>
          <p className="text-sm">Created by {name}</p>
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
              <div className="h-40">
                <GamePreviewLink
                  key={game.id}
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
          <CommentSection parentType={"list"} parentID={+id} />
        </div>
      ) : (
        <p className="text-lg text-error">List doesn't exist</p>
      )}
    </>
  );
};

export default ListPage;
