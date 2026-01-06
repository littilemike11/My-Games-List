import { List } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";
import Link from "next/link";
import Reactions from "./Reactions";
import TagItem from "./TagItem";
import PostOptions from "./PostOptions";
import Carousel from "./Carousel";
const ListItem: React.FC<{
  list: List;
}> = ({ list }) => {
  console.log(list);
  return (
    <>
      <div className="grid grid-cols-1 space-y-2 bg-base-100 w-full h-full rounded-lg border border-base-200 hover:shadow-lg shadow-sm transition-all duration-200 p-2">
        <div className="flex justify-between">
          <Link
            className="link link-hover decoration-primary"
            href={`/list/${list.id}`}
          >
            <h3 className="text-xl font-bold text-primary">{list.title}</h3>
          </Link>
          <PostOptions
            postType="list"
            postID={list.id}
            ownerID={list.profile.id}
            ownerName={list.profile.username}
          />
        </div>
        <Carousel games={list.games} />

        {/* <div className="flex border h-40 group overflow-hidden">
            {list.games.map((game) => (
              <div
                key={game.id}
                className="
                    flex-1 
                    transition-all duration-300 ease-in-out 
                    group-hover:flex-[0.7] hover:flex-[1.2] 
                  "
              >
                <GamePreviewLink game={game} isRound={false} />
              </div>
            ))}
          </div> */}
        <div className="flex gap-2 items-center">
          <figure>
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-sm">
                  {list.profile.username[0].toUpperCase()}
                </span>
              </div>
            </div>
          </figure>
          <p>Created by</p>
          <Link
            className="italic capitalize link link-hover"
            href={`/user/${list.profile.username}`}
          >
            {list.profile.username}
          </Link>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {list.tags?.map((tag) => (
            <TagItem key={tag.id} tag={tag} />
          ))}
        </div>
        {/* CTAs */}
        <div className=" card-actions items-center">
          <Reactions
            likeCount={list.likes ?? 0}
            dislikeCount={list.dislikes ?? 0}
            commentCount={list.comment_count ?? 0}
            parent_type="list"
            parent_id={list.id}
          />
        </div>
      </div>
    </>
  );
};

export default ListItem;
