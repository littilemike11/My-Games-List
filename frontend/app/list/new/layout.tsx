import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a List", // global template will append "| The Save Room"
  description:
    "Create a your own list of games on The Save Room and share it with the community.",

  robots: {
    index: false, // prevent search engines from indexing this utility page
    follow: false, // links inside don’t need to be followed
  },

  openGraph: {
    title: "Create a List",
    description:
      "Create a new game list and share it with the gaming community.",
    type: "website",
    url: "https://www.thesaveroom.co/list/new",
    // images: [
    //   {
    //     url: "/og-create-list.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Create a List",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Create a List",
    description:
      "Create a new game list and share it with the gaming community.",
    // images: ["/og-create-list.png"],
  },
};
export default function CreateListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>; // wraps the client page
}
