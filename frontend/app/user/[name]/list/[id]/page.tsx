"use client";
import ListItem from "@/app/components/ListItem";
import { useParams, usePathname } from "next/navigation";
import { getListByID } from "@/app/api/supabase-api/list-api";
import { useEffect, useState } from "react";
import { CustomList, List } from "@/app/types/models";
import CommentSection from "@/app/components/CommentSection";
import Reactions from "@/app/components/Reactions";
import GamePreviewLink from "@/app/components/GamePreviewLink";
const ListPage = () => {
  const { name, id } = useParams<{ name: string; id: string }>();
  const [list, setList] = useState<CustomList[]>();

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
      {list && list?.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline">
            <h2 className="text-3xl">{list[0].list_title}</h2>
            <p className="text-sm ml-2"> created by {name}</p>
          </div>
          <p> {list[0].list_description}</p>
          <ul className="flex ">
            {list[0].list_tags.map((tag) => (
              <li className="badge badge-outline">{tag}</li>
            ))}
          </ul>
          <Reactions
            likeCount={list[0].list_likes}
            dislikeCount={list[0].list_dislikes}
            commentCount={list[0].list_dislikes}
          />
          <div className="bg-base-100  w-full p-2 overflow-auto justify-around  flex gap-2 flex-wrap">
            {list.map((game) => (
              <GamePreviewLink
                game={{
                  id: game.game_id,
                  cover: game.game_cover,
                  name: game.game_name,
                  slug: game.game_slug,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* comments of List */}
      <CommentSection parentType={"list"} parentID={+id} />
    </>
  );
};

export default ListPage;
