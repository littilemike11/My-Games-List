import Link from "next/link";
import { Tag } from "../types/models";
import { addRecentSearch } from "../utils/functions";
const TagItem: React.FC<{ tag: Tag }> = ({ tag }) => {
  let badgeStyle;

  switch (tag.type) {
    case "community":
      badgeStyle = "badge-outline";
      break;
    case "official":
      badgeStyle = "badge-accent";
      break;
    case "restricted":
      badgeStyle = "badge-error";
      break;
  }

  return (
    <>
      <div>
        <Link
          onClick={() => addRecentSearch(tag.name, `/tag/${tag.name}`)}
          data-tip={tag?.description}
          className={`tooltip tooltip-right capitalize cursor-pointer h-fit badge ${badgeStyle}`}
          href={`/tag/${tag.name}`}
        >
          {tag.name}
        </Link>
      </div>
    </>
  );
};

export default TagItem;
