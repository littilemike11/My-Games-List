"use client";
import { FaPlus, FaChevronDown } from "react-icons/fa6";
import CreateReview from "../CreateReview";
import { Game, List, ListType } from "@/app/types/models";
import { getListsByUser, addGameToList } from "@/app/api/supabase-api/list-api";
import { useAuth } from "@/app/auth/auth-context";
import { useEffect, useState } from "react";
type CTAProps = {
  game: Game;
  gameID: number;
};
const CTA: React.FC<CTAProps> = ({ game, gameID }) => {
  const { session, profile } = useAuth();
  const userID = session?.user.id;
  const [defaultListMap, setDefaultListMap] = useState<Record<string, number>>(
    {}
  );

  // get the ids of the default lists
  function getDefaultListMap(lists: List[]): Record<string, number> {
    return lists
      .filter((list) => list.type !== "custom")
      .reduce((acc, list) => {
        acc[list.type] = list.id;
        return acc;
      }, {} as Record<string, number>);
  }

  const addGameByType = async (type: ListType) => {
    if (defaultListMap) {
      let response;
      try {
        let listID = defaultListMap[type];
        response = await addGameToList(gameID, listID);
        // if you favorite/ liked/playing, then also add to played
        if (type == "favorites" || type == "likes" || type == "playing") {
          let playingID = defaultListMap["played"];
          response = await addGameToList(gameID, playingID);
        }
        //if i favorite, i also liked
        if (type == "favorites") {
          let favID = defaultListMap["likes"];
          response = await addGameToList(gameID, favID);
        }
      } catch (error) {
        console.error("error adding game to list:", error);
      }
      console.log(response);
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        if (userID) {
          const lists = await getListsByUser(userID);
          console.log("lists", lists);
          setDefaultListMap(getDefaultListMap(lists));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchList();
  }, [userID]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <CreateReview game={game}></CreateReview>

        <div className="join">
          <button
            onClick={() => addGameByType("wishlist")}
            className="btn btn-primary btn-lg join-item"
          >
            <FaPlus />
            Wishlist
          </button>
          {/* dropdown */}
          <button className=" dropdown dropdown-end join-item ">
            <div
              title="Add to other Lists"
              tabIndex={0}
              role="button"
              className="btn btn-lg btn-primary rounded-r-full"
            >
              <FaChevronDown />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a onClick={() => addGameByType("wishlist")}>
                  <FaPlus />
                  Wishlist
                </a>
              </li>
              <li>
                <a onClick={() => addGameByType("playing")}>
                  <FaPlus />
                  Currently Playing
                </a>
              </li>
              <li>
                <a>
                  <FaPlus onClick={() => addGameByType("played")} />
                  Played
                </a>
              </li>
            </ul>
          </button>
        </div>
        <div>
          {/* favorite */}
          <button
            title="Add to Favorites"
            className="btn btn-circle btn-ghost group"
            onClick={() => addGameByType("favorites")}
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
          {/* liked button */}
          <button
            title="Add to Likes"
            className="btn btn-circle btn-ghost group"
            onClick={() => addGameByType("likes")}
          >
            <svg
              className="size-[1.4em] fill-current group-hover:text-yellow-300 transition-colors"
              height="1792"
              viewBox="0 0 1792 1792"
              width="1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M320 1344q0-26-19-45t-45-19q-27 0-45.5 19t-18.5 45q0 27 18.5 45.5t45.5 18.5q26 0 45-18.5t19-45.5zm160-512v640q0 26-19 45t-45 19h-288q-26 0-45-19t-19-45v-640q0-26 19-45t45-19h288q26 0 45 19t19 45zm1184 0q0 86-55 149 15 44 15 76 3 76-43 137 17 56 0 117-15 57-54 94 9 112-49 181-64 76-197 78h-129q-66 0-144-15.5t-121.5-29-120.5-39.5q-123-43-158-44-26-1-45-19.5t-19-44.5v-641q0-25 18-43.5t43-20.5q24-2 76-59t101-121q68-87 101-120 18-18 31-48t17.5-48.5 13.5-60.5q7-39 12.5-61t19.5-52 34-50q19-19 45-19 46 0 82.5 10.5t60 26 40 40.5 24 45 12 50 5 45 .5 39q0 38-9.5 76t-19 60-27.5 56q-3 6-10 18t-11 22-8 24h277q78 0 135 57t57 135z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
export default CTA;
