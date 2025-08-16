import { List } from "../types/models";

type listPreviewMax = 5 | 10;
// is half = true => shows max 5 games instead of 10
const ListItem: React.FC<{ list: List[]; isHalf?: listPreviewMax }> = ({
  list,
  isHalf = 5,
}) => {
  const displayLists = list.slice(0, isHalf); // first `isHalf` items

  return (
    <>
      <div>
        {displayLists.map((list) => (
          <div>
            <h1>{list.title}</h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListItem;
