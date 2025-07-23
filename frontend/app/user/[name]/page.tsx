interface Props {
  params: { name: string };
}
import type { User } from "@/app/types/models";
import { exampleUsers } from "@/app/mockData/users";
export default function User({ params }: Props) {
  const currentUser: User | undefined = exampleUsers.find(
    (user) => user.username.toLowerCase() === params.name.toLowerCase()
  );

  if (!currentUser) {
    return <p>User not found</p>;
  }

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* username */}
        <section>
          <div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                    </div>
                  </div>
                  <h1 className="text-4xl">{currentUser.username}</h1>
                  <button className="btn btn-sm">edit profile</button>
                </div>
                <div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-value">
                        {currentUser.followers.length}
                      </div>
                      <div>followers</div>
                    </div>

                    <div className="stat">
                      <div className="stat-value">
                        {currentUser.following.length}
                      </div>
                      <div>following</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p>{currentUser.bio}</p>
            </div>
          </div>
        </section>

        {/* games */}
        <section>
          <h2> Games</h2>
          <div className="divider"></div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-value">
                {currentUser.played.games.length}
              </div>
              <div>✅ played</div>
            </div>

            <div className="stat">
              <div className="stat-value">
                {currentUser.playing.games.length}
              </div>
              <div>🎮playing</div>
            </div>

            <div className="stat">
              <div className="stat-value">
                {currentUser.wishlist.games.length}
              </div>
              <div>💭wishlist</div>
            </div>
          </div>
        </section>
        {/* stats */}

        <section>
          <h2>Activity</h2>
          <div className="divider"></div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-value">{currentUser.reviews.length}</div>
              <div>⭐reviews</div>
            </div>

            <div className="stat">
              <div className="stat-value">{currentUser.discussions.length}</div>
              <div>💬discussions</div>
            </div>
          </div>
        </section>

        <section>
          <div>
            <h2>Lists</h2>
            <div className="divider"></div>
            <div className="stats shadow">
              {" "}
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-value">{currentUser.lists.length}</div>
                  <div>📜lists </div>
                </div>

                <div className="stat">
                  <div className="stat-value">
                    {currentUser.playing.games.length}
                  </div>
                  <div>👍liked</div>
                </div>

                <div className="stat">
                  <div className="stat-value">
                    {currentUser.wishlist.games.length}
                  </div>
                  <div>❤️favorites</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
