import { GamePreview, List, UserGameList } from "../types/models";
import GamePreviewLink from "./GamePreviewLink";

type listPreviewMax = 5 | 10;
// is half = true => shows max 5 games instead of 10
const ListItem: React.FC<{
  gameList: any;
  isHalf?: listPreviewMax;
}> = ({ gameList, isHalf = 5 }) => {
  console.log(gameList);
  return (
    <>
      <div>
        {gameList.lists.map((list: any) => (
          <div key={list.list_id} className="flex-col gap-2">
            <h3>{list.list_title}</h3>
            <div className="flex gap-4 border">
              {list.games.map((game: GamePreview) => (
                <div key={game.id}>
                  <GamePreviewLink game={game} height={32} />
                </div>
              ))}
            </div>
            <p>created by {gameList.username}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListItem;
