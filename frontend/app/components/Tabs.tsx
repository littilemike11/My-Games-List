"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SORT_OPTIONS: Record<
  string,
  { label: string; value: string; order: "asc" | "desc" }[]
> = {
  posts: [
    { label: "Most Liked", value: "likes", order: "desc" },
    { label: "Most Commented", value: "comments", order: "desc" },
    { label: "Date(desc ↓)", value: "date", order: "desc" },
    { label: "Date(asc ↑)", value: "date", order: "asc" },
  ],
  //  games: [
  //     { label: "Alphabetical", value: "title" },
  //     { label: "Most Discussed", value: "comments" },
  //   ],
  reviews: [
    { label: "Most Liked", value: "likes", order: "desc" },
    { label: "Most Commented", value: "comments", order: "desc" },
    { label: "Date(desc ↓)", value: "date", order: "desc" },
    { label: "Date(asc ↑)", value: "date", order: "asc" },
  ],
  discussions: [
    { label: "Most Liked", value: "likes", order: "desc" },
    { label: "Most Commented", value: "comments", order: "desc" },
    { label: "Date(desc ↓)", value: "date", order: "desc" },
    { label: "Date(asc ↑)", value: "date", order: "asc" },
  ],
  lists: [
    { label: "Most Liked", value: "likes", order: "desc" },
    { label: "Most Commented", value: "comments", order: "desc" },
    { label: "Date(desc ↓)", value: "date", order: "desc" },
    { label: "Date(asc ↑)", value: "date", order: "asc" },
  ],
  players: [
    { label: "Highest Level", value: "level", order: "desc" },
    { label: "Most Followed", value: "followers", order: "desc" },
    { label: "Alphabetical(desc ↓)", value: "name", order: "desc" },
    { label: "Alphabetical(asc ↑)", value: "name", order: "asc" },
  ],
  tags: [
    { label: "Most Used", value: "usage", order: "desc" },
    { label: "Most Followed", value: "followers", order: "desc" },
    { label: "Alphabetical(desc ↓)", value: "name", order: "desc" },
    { label: "Alphabetical(asc ↑)", value: "name", order: "asc" },
  ],
};

const Tabs = () => {
  const pathname = usePathname();

  // Extract the current tab (e.g., "/popular/reviews" → "reviews")
  const activeTab =
    pathname.split("/")[2] && pathname.split("/")[1] === "popular"
      ? pathname.split("/")[2]
      : "";

  //   const sortOptions = SORT_OPTIONS[activeTab] || SORT_OPTIONS["everything"];

  //   const handleSort = (sortValue: string) => {
  //     const basePath = `/popular/${activeTab}`;
  //     router.push(`${basePath}?sort=${sortValue}`);
  //   };
  const tabs = [
    { name: "Everything", slug: "" },
    { name: "All Posts", slug: "posts" },
    // { name: "Games", slug: "games" },
    { name: "Reviews", slug: "reviews" },
    { name: "Discussions", slug: "discussions" },
    { name: "Lists", slug: "lists" },
    { name: "Players", slug: "players" },
    { name: "Tags", slug: "tags" },
  ];

  return (
    <>
      <div className=" w-full border-b-2 flex justify-center mt-4 mb-6 gap-2">
        <div className="overflow-x-auto max-w-full ">
          <div role="tablist" className="tabs tabs-border min-w-max ">
            {tabs.map((tab) => (
              <Link
                key={tab.slug}
                href={`/popular/${tab.slug}`}
                role="tab"
                className={`tab px-4 transition-colors ${
                  activeTab === tab.slug
                    ? "tab-active text-primary hover:text-primary border-primary"
                    : "hover:text-primary/70"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
        {activeTab !== "" && (
          <details className="dropdown dropdown-end">
            <summary className="btn btn-sm m-1">
              {/* sort */}
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="sliders"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="size-4"
              >
                <path
                  fill="currentColor"
                  d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                ></path>
              </svg>
            </summary>
            <ul className="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
              {/* or go to /popular/active-tab-name/sort-option */}
              {SORT_OPTIONS[activeTab].map((option, index) => (
                <li key={index}>
                  <Link
                    href={`/popular/${activeTab}?sort=${option.value}&order=${option.order}`}
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </>
  );
};

export default Tabs;
