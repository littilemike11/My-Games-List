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
      <div className=" w-full border-b-2 flex justify-center mt-4 mb-6">
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
          <details className="dropdown dropdown-end ">
            <summary className="btn btn-sm m-1">
              {/* sort */}
              <svg
                className=" fill-current "
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
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
