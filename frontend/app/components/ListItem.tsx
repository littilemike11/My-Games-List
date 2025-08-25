import { GamePreview, List, UserGameList } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";
import Link from "next/link";
// is half = true => shows max 5 games instead of 10
const ListItem: React.FC<{
  gameList: any;
}> = ({ gameList }) => {
  console.log(gameList);
  return (
    <>
      <div>
        {gameList.lists.map((list: any) => (
          <div key={list.list_id} className="flex-col  gap-2">
            <h3>{list.list_title}</h3>
            <div className="flex border w-96 relative h-36 group overflow-hidden">
              {list.games.map((game: GamePreview) => (
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
                      {gameList.username[0].toUpperCase()}
                    </span>
                  </div>
                </div>
              </figure>
              <p>Created by</p>
              <Link
                className="italic link link-hover"
                href={`/user/${gameList.username}`}
              >
                {gameList.username}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListItem;
