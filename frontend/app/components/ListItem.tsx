import { List } from "../types/models";
import Link from "next/link";
import Reactions from "./Reactions";
import TagItem from "./TagItem";
import PostOptions from "./PostOptions";
import Carousel from "./Carousel";
import { formatDate } from "../utils/functions";
const ListItem: React.FC<{
  list: List;
}> = ({ list }) => {
  console.log(list);
  return (
    <>
      <article className="min-w-0 w-full overflow-hidden px-2 rounded-lg border border-base-200 bg-base-100 shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="p-3 sm:p-4">
          {/* Title + options */}
          <div className="flex items-start gap-2">
            <Link href={`/list/${list.id}`} className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-base font-bold leading-tight text-primary sm:text-lg link link-hover decoration-primary">
                {list.title}
              </h3>
            </Link>

            <PostOptions
              postType="list"
              postID={list.id}
              ownerID={list.profile.id}
              ownerName={list.profile.username}
            />
          </div>

          {/* Author + date */}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs sm:text-sm opacity-70">
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-6 rounded-full">
                <span>{list.profile?.username[0].toUpperCase()}</span>
              </div>
            </div>
            <Link
              href={`/user/${list.profile?.username}`}
              className="font-medium hover:underline"
            >
              @{list.profile?.username || "deleted"}
            </Link>

            <span>·</span>

            <time>{formatDate(list.created_at)}</time>
          </div>
        </div>

        {/* Games */}
        <div className="min-w-0 px-3 sm:px-4">
          <Carousel isList={true} games={list.games} />
        </div>

        {/* Footer */}
        <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
          {/* Tags */}
          {list.tags && list.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {list.tags.map((tag) => (
                <TagItem key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          {/* Reactions */}
          <div className="mt-3 flex items-center">
            <Reactions
              likeCount={list.likes ?? 0}
              dislikeCount={list.dislikes ?? 0}
              commentCount={list.comment_count ?? 0}
              parent_type="list"
              parent_id={list.id}
            />
          </div>
        </div>
      </article>
    </>
  );
};

export default ListItem;
