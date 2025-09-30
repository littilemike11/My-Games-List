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
      <Link href={`tags/${tag.name}`}>
        <div className="tooltip" data-tip={tag.description}>
          <button type="button" className={`capitalize badge ${badgeStyle}`}>
            {tag.name}
          </button>
        </div>
      </Link>
    </>
  );
};

export default TagItem;
