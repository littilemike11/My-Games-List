"use client";
import Carousel from "./components/Carousel";
import PostList from "./components/PostList";
import { exampleReviews } from "./mockData/reviews";
import { exampleDiscussions } from "./mockData/discussions";
import getGames from "./api";
import { useEffect, useState } from "react";
import { Game } from "./types/models";
import { parseGame } from "./utils/functions";
export default function Home() {
  const [popularGames, setPopularGames]=useState<Game[]>([])
  const [recentGames,setRecentGames]= useState<Game[]>([])

  const fetchData = async () => {
    const queries=[
      "fields cover.url, first_release_date, genres.name, name, platforms.name, slug, storyline, summary, themes.name;where version_parent=null & rating > 90 ;sort rating_count desc;", //popular
      "fields cover.url, first_release_date, genres.name, name, platforms.name, slug, storyline, summary, themes.name;where first_release_date < 1747948800 & version_parent=null & rating > 90 ;sort first_release_date desc;",//recent
    ]
    // maybe add top rated
    try{
      const responses = await Promise.all(queries.map(query=> getGames(query)));
      console.log("Popular", responses[0]);
      setPopularGames(responses[0].map(parseGame))
      console.log("popular", responses)
      setRecentGames(responses[1].map(parseGame))
    }catch(error){
       console.error("One of the requests failed:", error);
    }
    
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      
      <div className="flex flex-col items-center">
        <h1 className="text-3xl">Welcome to My Games List.</h1>
        <h2 className="mt-5 text-xl">
          A game review site for gamers by gamers.
        </h2>

        <Carousel title="Popular" games={popularGames}/>
        <Carousel title="Recent" games={recentGames} />
        <PostList posts={exampleReviews} type={"Review"} />
        <PostList posts={exampleDiscussions} type={"Discussion"} />
      </div>
      
    </div>
  );
}
