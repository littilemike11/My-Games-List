import { Discussion, Post, Review } from "../types/models";
import DiscussionItem from "./DiscussionItem";
import ReviewItem from "./ReviewItem";

type PostListProps = {
  posts: Post[];
  type?: "Review" | "Discussion";
};
const PostList: React.FC<PostListProps> = ({ posts, type = "Review" }) => {
  return (
    <>
      <div>
        {type === "Review" ? (
          <ul className="list bg-base-100">
            <h3 className="p-4 pb-2 text-lg opacity-60 tracking-wide">
              Popular Reviews this week
            </h3>
            {posts
              .filter((post): post is Review => "rating" in post)
              .map((review) => (
                <li key={review.id} className="list-row flex p-2">
                  <ReviewItem review={review} />
                </li>
              ))}
          </ul>
        ) : (
          <div>
            <h3 className="p-4 pb-2 text-lg opacity-60 tracking-wide">
              See what people are talking about{" "}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-content-stretch">
              {posts
                .filter((post): post is Discussion => !("rating" in post))
                .map((discussion) => (
                  <div key={discussion.id}>
                    <DiscussionItem discussion={discussion} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default PostList;
