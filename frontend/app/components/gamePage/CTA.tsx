"use client";
import { FaPlus, FaChevronDown } from "react-icons/fa6";
import CreateReview from "../CreateReview";
import { Game, List, ListType, StatusKey } from "@/app/types/models";
import {
  getUserGame,
  upsertUserGameStatus,
} from "@/app/api/supabase-api/list-api";
import { useAuth } from "@/app/auth/auth-context";
import { useEffect, useState } from "react";
type CTAProps = {
  game: Game;
  gameID: number;
};
type GameStatus = {
  played: boolean;
  playing: boolean;
  wishlist: boolean;
  favorite: boolean;
};

const CTA: React.FC<CTAProps> = ({ game, gameID }) => {
  const { session, profile } = useAuth();
  const userID = session?.user.id;

  const [gameStatus, setGameStatus] = useState<GameStatus>({
    played: false,
    playing: false,
    wishlist: false,
    favorite: false,
  });

  const toggleGameStatus = async (status: StatusKey) => {
    try {
      // Update local state first
      setGameStatus((prev) => ({
        ...prev,
        [status]: !prev[status], // toggle the specific status
      }));
      if (userID) {
        const updateStatus = await upsertUserGameStatus(
          gameID,
          userID,
          status,
          !gameStatus[status]
        );
        console.log(updateStatus);
      }
    } catch (error) {
      console.error("error adding game to list:", error);
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        if (userID) {
          const response = await getUserGame(undefined, userID, gameID);
          console.log("gameStatus", response);
          if (response) {
            setGameStatus(response);
          }
          // setDefaultListMap(getDefaultListMap(response));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchList();
  }, [userID]);
  const statusOptions: {
    key: StatusKey;
    label: string;
    activeLabel: string;
    emoji: string;
    color: string;
  }[] = [
    {
      key: "wishlist",
      label: "Wishlist Now",
      activeLabel: "Wishlisted",
      emoji: "📝",
      color: "yellow",
    },
    {
      key: "playing",
      label: "Not Active",
      activeLabel: "Actively Playing",
      emoji: "🎮",
      color: "blue",
    },
    {
      key: "played",
      label: "Mark as Played",
      activeLabel: "Played",
      emoji: "✅",
      color: "green",
    },
    {
      key: "favorite",
      label: "Add to Favorites",
      activeLabel: "Favorited",
      emoji: "❤️",
      color: "red",
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <CreateReview game={game}></CreateReview>

        <div className="join">
          {/* Primary button for the first status (wishlist in this example) */}
          <button
            onClick={() => toggleGameStatus("wishlist")}
            className="btn btn-primary btn-lg join-item"
          >
            {gameStatus.wishlist ? "📝 Wishlisted" : "📝 Wishlist Now"}
          </button>

          {/* Dropdown for all statuses */}
          <button className="dropdown dropdown-end join-item">
            <div
              title="Add to other gameStatus"
              tabIndex={0}
              role="button"
              className="btn btn-lg btn-primary rounded-r-full"
            >
              <FaChevronDown />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-gray-100 rounded-box z-10 w-52 p-2 shadow-sm"
            >
              {statusOptions.map((status) => {
                const isActive =
                  gameStatus[status.key as keyof typeof gameStatus];
                return (
                  <li key={status.key}>
                    <a
                      className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                ${
                  isActive
                    ? `bg-${status.color}-200 text-${status.color}-800`
                    : " text-gray-500 hover:bg-gray-200"
                }`}
                      onClick={() => toggleGameStatus(status.key)}
                    >
                      {status.emoji}{" "}
                      {isActive ? status.activeLabel : status.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </button>
        </div>

        <div>
          {/* favorite */}
          {gameStatus.favorite ? (
            <button
              title="Remove from Favorites"
              className="btn btn-circle btn-ghost group"
              onClick={() => toggleGameStatus("favorite")}
            >
              ❤️
            </button>
          ) : (
            <button
              title="Add to Favorites"
              className="btn btn-circle btn-ghost group"
              onClick={() => toggleGameStatus("favorite")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="red"
                className="size-[1.2em] group-hover:fill-red-500 transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default CTA;
