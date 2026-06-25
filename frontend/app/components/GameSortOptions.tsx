/* SORTING
    Rating
    Title
    Release date
    Hypes
    */
// import { FaSortAlphaUp } from "react-icons/fa";
import { FaSortAlphaUpAlt } from "react-icons/fa";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { FaSort } from "react-icons/fa";

const GameSortOptions = () => {
  return (
    <>
      <div className="flex justify-between border-b-2">
        <button className="btn btn-md">
          <p className="font-bold">Title</p>
          <FaSortAlphaDown />
        </button>
        <div className="flex gap-1">
          <button className="btn btn-md">
            <p className="font-bold">Rating</p>
            <FaSortAmountDown />
          </button>
          <button className="btn btn-md">
            <p className="font-bold">Hypes</p>
            <FaSortAmountDown />
          </button>
          <button className="btn btn-md">
            <p className="font-bold">Date</p>
            <FaSort />
          </button>
        </div>
      </div>
    </>
  );
};

export default GameSortOptions;
