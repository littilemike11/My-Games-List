"use client";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Footer from "./components/Footer";
import PostList from "./components/PostList";
import { exampleReviews } from "./mockData/reviews";
import { exampleDiscussions } from "./mockData/discussions";
import getGames from "./api";
import { useEffect } from "react";
export default function Home() {
  const fetchData = async () => {
    const response = await getGames();
    console.log(response);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl">Welcome to My Games List.</h1>
        <h2 className="mt-5 text-xl">
          A game review site for gamers by gamers.
        </h2>

        <Carousel title="Popular" />
        <Carousel title="Recent" />
        <PostList posts={exampleReviews} type={"Review"} />
        <PostList posts={exampleDiscussions} type={"Discussion"} />
      </div>
      <Footer />
    </div>
  );
}
