const Page = () => {
  return (
    <>
      <header>
        <div className="flex flex-col space-y-2 pt-4">
          <h1 className="text-4xl text-pretty text-center font-bold">
            Welcome to <span className="italic">The Save Room</span>
          </h1>
          <h2 className="text-xl text-center ">
            A community hub for gamers by gamers.
          </h2>
        </div>
      </header>

      <main>
        <div className="flex flex-col h-96 space-y-4 pt-20 items-center  w-full">
          <input
            type="text"
            placeholder="Search anything gaming related"
            className="input input-bordered w-1/2 "
          />
          <div className="flex gap-10 ">
            <button title="See what's trending" className="btn btn-primary">
              What's Meta?
            </button>
            <button
              title="See what we think you'll like"
              className="btn btn-primary"
            >
              For You
            </button>
          </div>
        </div>
      </main>
      <div className="fab fab-flower">
        {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
        <div
          tabIndex={0}
          role="button"
          className="btn btn-lg btn-info btn-circle"
        >
          F
        </div>

        {/* Main Action button replaces the original button when FAB is open */}
        <button className="fab-main-action btn btn-circle btn-lg btn-success">
          M
        </button>

        {/* buttons that show up when FAB is open */}
        <div className="tooltip tooltip-left" data-tip="Label A">
          <button className="btn btn-lg btn-circle">A</button>
        </div>
        <div className="tooltip tooltip-left" data-tip="Label B">
          <button className="btn btn-lg btn-circle">B</button>
        </div>
        <div className="tooltip" data-tip="Label C">
          <button className="btn btn-lg btn-circle">C</button>
        </div>
        <div className="tooltip" data-tip="Label D">
          <button className="btn btn-lg btn-circle">D</button>
        </div>
      </div>
    </>
  );
};
export default Page;
