"use client";
import {
  Discussion,
  Game,
  GamePreview,
  List,
  Review,
} from "@/app/types/models";
import { getReviewsByGame } from "@/app/api/supabase-api/review-api";
import { useEffect, useState } from "react";
import GamePreviewLink from "../GamePreviewLink";
import CreateReview from "../CreateReview";
import ReviewItem from "../ReviewItem";
import CreateDiscussion from "../CreateDiscussion";
import {
  getDiscussionsByTag,
  getDiscussionsByTags,
} from "@/app/api/supabase-api/discussion-api";
import DiscussionItem from "../DiscussionItem";
import { getListsByGame } from "@/app/api/supabase-api/list-api";
import ListItem from "../ListItem";
import CreateList from "../CreateList";
type TabProps = {
  game: Game;
  gameID: number;
  screenshots: string[];
  artwork: string[];
  videos: {
    name?: string;
    url: string;
  }[];
  similarGames: GamePreview[];
  franchise: GamePreview[];
};
const TabSection: React.FC<TabProps> = ({
  game,
  gameID,
  screenshots,
  artwork,
  videos,
  similarGames,
  franchise,
}) => {
  console.log(gameID);
  const tabs = [
    "Reviews",
    "Discussions",
    "Lists",
    "Screenshots",
    "Artwork",
    "Videos",
    "Similar Games",
    "Related Content",
  ];
  const [activeTab, setActiveTab] = useState("Reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const fetchReviews = async () => {
    const response = await getReviewsByGame(game.slug);
    console.log("id", game.slug);
    console.log(response);
    setReviews(response);
  };
  const fetchDiscussions = async () => {
    // const response = await getDiscussionsByTag(game.slug);
    // console.log("dicussions", response);
    // setDiscussions(response);
    const response = await getDiscussionsByTags([game.slug]);
    console.log("discussions", response);
    setDiscussions(response);
  };
  const fetchLists = async () => {
    const response = await getListsByGame(gameID);
    console.log("id", gameID);
    console.log(response);
    setLists(response ?? []);
  };
  useEffect(() => {
    fetchReviews();
    fetchDiscussions();
    fetchLists();
  }, []);
  // const reviews: Review[] = await getReviewsByGame();
  const renderTabContent = () => {
    switch (activeTab) {
      case "Reviews":
        return reviews?.length ? (
          <div className="flex flex-col gap-4">
            <CreateReview game={game} />
            {reviews.map((review) => (
              <ReviewItem showCover={false} key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>Be the first to leave a Review!</p>
            <CreateReview game={game} />
          </div>
        );
      case "Discussions":
        return discussions?.length ? (
          <div className="flex flex-col gap-4">
            <CreateDiscussion ctaType="game" />
            {discussions.map((discussion) => (
              <DiscussionItem discussion={discussion} key={discussion.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>Be the first to start a Discussion</p>
            <CreateDiscussion ctaType="game" />
          </div>
        );
      case "Lists":
        return lists?.length ? (
          <div className="flex flex-col gap-4">
            <CreateList />
            {lists.map((list) => (
              <ListItem list={list} key={list.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>Be the first to add this Game to a list</p>
            <CreateList />
          </div>
        );
      case "Screenshots":
        return screenshots.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {screenshots.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`screenshot-${index}`}
                className="rounded-xl shadow-md w-full object-cover"
              />
            ))}
          </div>
        ) : (
          <p>No screenshots available</p>
        );
      case "Artwork":
        return artwork.length ? (
          <div className="flex flex-wrap gap-4">
            {artwork.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`artwork-${index}`}
                className="rounded-xl shadow-md w-full object-cover"
              />
            ))}
          </div>
        ) : (
          <p>No Artwork available</p>
        );
      case "Videos":
        return videos.length ? (
          <div className="flex flex-wrap place-content-center gap-4">
            {videos.map((vid, index) => (
              <iframe
                key={index}
                className="w-full sm:w-96 sm:h-80  h-48"
                // width="420"
                // height="315"
                src={`https://www.youtube.com/embed/${vid.url}`}
              ></iframe>
            ))}
          </div>
        ) : (
          <p>No Videos available</p>
        );
      case "Similar Games":
        return similarGames.length ? (
          <ul className=" pb-4 flex flex-wrap gap-6 place-content-around">
            {similarGames.map((simGame) => (
              <li key={simGame.id} className="h-56 w-44">
                <GamePreviewLink game={simGame} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No similar games found.</p>
        );
      case "Related Content":
        return franchise?.length ? (
          <ul className="pb-4 flex flex-wrap gap-6 place-content-around">
            {franchise.map((game) => (
              <li key={game.id} className="h-56 w-44">
                <GamePreviewLink game={game} />
              </li>
            ))}
          </ul>
        ) : (
          <p>This is not part of a franchise.</p>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <div>
        <div className="sticky z-10 bg-base-100 top-16">
          {/* Mobile Dropdown */}
          {/* <div className="md:hidden">
            <select
              className="select select-bordered select-lg w-full "
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              {tabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
          </div> */}

          {/* Desktop Tabs */}
          {/* <div className="hidden md:flex space-x-6   border-base-300">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={` text-xl font-semibold cursor-pointer hover:text-white ${
                  activeTab == tab
                    ? "border-b-4 border-primary text-white"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div> */}

          <div className="w-full border-b-2 flex justify-center mt-4 mb-6">
            <div className="overflow-x-auto max-w-full ">
              <div role="tablist" className="tabs tabs-border min-w-max ">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    role="tab"
                    onClick={() => setActiveTab(tab)}
                    className={`tab px-4 transition-colors ${
                      activeTab === tab
                        ? "tab-active text-primary hover:text-primary border-primary"
                        : "hover:text-primary/70"
                    }`}
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Tab Content */}
        <div className="bg-base-100 p-4 border border-base-300 rounded-xl shadow">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};
export default TabSection;
