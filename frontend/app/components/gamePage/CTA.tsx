import { FaSquarePen, FaPlus, FaChevronDown } from "react-icons/fa6";

const CTA = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row  gap-6">
        <button className="btn btn-primary w-max btn-lg">
          <FaSquarePen />
          Write a Review
        </button>
        <div className="flex gap-4 items-center">
          <div className="join">
            <button className="btn btn-primary btn-lg join-item">
              <FaPlus />
              Add to List
            </button>
            <button className="join-item btn btn-lg btn-primary rounded-r-full">
              <FaChevronDown />
            </button>
          </div>
          <button className="btn btn-circle btn-ghost group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="red"
              className="size-[1.2em] group-hover:fill-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
export default CTA;
