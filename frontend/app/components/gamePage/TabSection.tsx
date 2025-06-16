"use client";
import { Discussion, GamePreview, Review } from "@/app/types/models";
import { useState } from "react";
import GamePreviewLink from "../GamePreviewLink";
type TabProps = {
  screenshots: string[];
  similarGames: GamePreview[];
  franchise: GamePreview[];
  reviews: Review[];
  discussions: Discussion[];
};
const TabSection: React.FC<TabProps> = ({
  screenshots,
  similarGames,
  franchise,
  reviews,
  discussions,
}) => {
  const tabs = [
    "Reviews",
    "Discussions",
    "Screenshots",
    "Similar Games",
    "Related Content",
  ];
  const [activeTab, setActiveTab] = useState("Reviews");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Reviews":
        return reviews?.length ? (
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
          <p>Be the first to leave a Review</p>
        );
      case "Discussions":
        return discussions?.length ? (
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
          <p>Be the first to start a Discussion</p>
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
      case "Similar Games":
        return similarGames.length ? (
          <ul className=" pb-4 flex flex-wrap gap-6 place-content-around">
            {similarGames.map((simGame) => (
              <li key={simGame.id} className="h-56">
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
              <li key={game.id} className="h-56">
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
        <div className="sticky top-0">
          {/* Mobile Dropdown */}
          <div className="md:hidden">
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
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex space-x-6  border-base-300">
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
