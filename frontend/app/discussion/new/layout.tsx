// app/list/new/layout.tsx (server component)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Discussion", // global template will append "| The Save Room"
  description: "What are your thoughts? Start a discussion on The Save Room.",

  robots: {
    index: false, // prevent search engines from indexing this utility page
    follow: false, // links inside don’t need to be followed
  },

  openGraph: {
    title: "Start a Discussion",
    description: "Start a new discussion.",
    type: "website",
    url: "https://www.thesaveroom.co/discussion/new",
    // images: [
    //   {
    //     url: "/og-create-discussion.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Create a discussion",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Start a Discussion",
    description: "Start a new discussion.",
    // images: ["/og-create-discussion.png"],
  },
};
export default function CreateDiscussionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>; // wraps the client page
}
