import { List } from "../types/models";
import { addRecentSearch } from "../utils/functions";
import GamePreviewLink from "./GamePreviewLink";
import Link from "next/link";
const ListItem: React.FC<{
  list: List;
}> = ({ list }) => {
  console.log(list);
  return (
    <>
      <div>
        <div className="flex flex-col space-y-2 w-full">
          <Link
            className="link link-hover"
            href={`/user/${list.profile.username}/list/${list.id}`}
          >
            <h3 className="text-xl font-medium">{list.title}</h3>
          </Link>

          <div className="flex border w-96 relative h-36 group overflow-hidden">
            {list.games.map((game) => (
              <div
                key={game.id}
                className="
                    flex-1 
                    transition-all duration-300 ease-in-out 
                    group-hover:flex-[0.7] hover:flex-[1.3]
                  "
              >
                <GamePreviewLink game={game} height={36} isRound={false} />
              </div>
            ))}
          </div>
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
              className="italic link link-hover"
              href={`/user/${list.profile.username}`}
              onClick={() =>
                addRecentSearch(
                  list.profile.username,
                  `/user/${list.profile.username}`
                )
              }
            >
              {list.profile.username}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListItem;
