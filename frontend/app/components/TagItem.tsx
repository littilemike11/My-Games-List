import Link from "next/link";
import { Tag } from "../types/models";
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
      <div className="tooltip tooltip-right " data-tip={tag?.description}>
        <Link
          className={`capitalize cursor-pointer h-fit badge ${badgeStyle}`}
          href={`/tag/${tag.name}`}
        >
          {tag.name}
        </Link>
      </div>
    </>
  );
};

export default TagItem;
