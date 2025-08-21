import { List, UserGameList } from "../types/models";

type listPreviewMax = 5 | 10;
// is half = true => shows max 5 games instead of 10
const ListItem: React.FC<{
  gameList: UserGameList[];
  isHalf?: listPreviewMax;
}> = ({ gameList, isHalf = 5 }) => {
  console.log(gameList);
  return (
    <>
      <div></div>
    </>
  );
};

export default ListItem;
