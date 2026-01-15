import Search from "../components/Search";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search posts, tags and other players in The Save Room",

  robots: {
    index: false,
    follow: false,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=" pt-4 p-4 w-full">
        <div className="lg:hidden">
          <Search />
        </div>
        {children}
      </div>
    </>
  );
}
