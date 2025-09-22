import Navbar from "./Navbar";
export default function DrawerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Navbar /> */}
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content pt-16 flex flex-col ">
          {/* Page content here */}
          {/* <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label> */}
          {children}
        </div>
        {/* drawer side */}
        <div className="drawer-side pt-16">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <nav className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">
            {/* Main nav */}
            <ul className="font-medium space-y-2">
              <li>For You</li>
              <li>Popular</li>
              <li>Latest</li>
            </ul>

            {/* Content Filters */}
            <div className="border-y-2 border-base-300">
              <div className="collapse collapse-plus border-base-300">
                <input type="checkbox" />
                <div className="collapse-title font-medium text-lg">
                  Content
                </div>
                <div className="collapse-content space-y-2">
                  {["Reviews", "Discussions", "Lists", "Players", "News"].map(
                    (item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="checkbox"
                        />
                        {item}
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Recently Visited */}
            <div className="border-y-2 border-base-300">
              <div className="collapse collapse-plus">
                <input type="checkbox" />
                <div className="collapse-title font-medium text-lg">
                  Recently Visited
                </div>
                <div className="collapse-content">
                  <ul className="list-disc list-inside text-sm">
                    {/* dynamically populate visited items */}
                  </ul>
                </div>
              </div>
            </div>
            {/* Tags */}
            <div className="border-y-2 border-base-300">
              <div className="collapse collapse-plus">
                <input type="checkbox" />
                <div className="collapse-title font-medium text-lg">Tags</div>
                <div className="collapse-content">
                  <ul className="list-disc list-inside text-sm">
                    {/* dynamically populate visited items */}
                  </ul>
                </div>
              </div>
            </div>

            {/* Personalize with nested collapsibles */}
            <div className="border-y-2 border-base-300">
              <div className="collapse collapse-plus border-base-300">
                <input type="checkbox" />
                <div className="collapse-title font-medium text-lg">
                  Personalize
                </div>
                <div className="collapse-content space-y-2">
                  {/* Nested collapsibles */}
                  {["Platforms", "Genres", "Themes", "Games"].map((section) => (
                    <div
                      key={section}
                      className="collapse collapse-plus border border-base-100 rounded-lg"
                    >
                      <input type="checkbox" />
                      <div className="collapse-title">{section}</div>
                      <div className="collapse-content text-sm">
                        {/* dynamic filters go here */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-y-2 border-base-300">
              <div className="collapse collapse-plus">
                <input type="checkbox" />
                <div className="collapse-title font-medium text-lg">
                  Followers
                </div>
                <div className="collapse-content">
                  <ul className="list-disc list-inside text-sm">
                    {/* dynamically populate visited items */}
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
