import Quote from "../components/Quote";
const Page = () => {
  return (
    <>
      {/* <header>
        <div className="flex flex-col space-y-2 pt-4">
          <h1 className="text-4xl text-pretty text-center font-bold">
            Welcome to <span className="italic">The Save Room</span>
          </h1>
          <h2 className="text-xl text-center ">insert game quote</h2>
        </div>
      </header> */}

      <main>
        <div className="flex flex-col h-96 space-y-4 pt-20 items-center  w-full">
          <input
            type="text"
            placeholder="Search anything gaming related"
            className="input input-bordered w-1/2 "
          />
          <div className="flex gap-10 ">
            <Quote
              content="It's dangerous to go alone! Take this."
              origin="The Legend of Zelda"
            />
          </div>
        </div>
      </main>
    </>
  );
};
export default Page;
