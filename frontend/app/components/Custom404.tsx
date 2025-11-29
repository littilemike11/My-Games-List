import Link from "next/link";
import Quote from "@/app/components/Quote";
import { errorQuotes } from "@/app/mockData/quotes";
const Custom404: React.FC<{ title?: string }> = ({
  title = "404 | Page Not Found",
}) => {
  let randomQuote = errorQuotes[Math.floor(Math.random() * errorQuotes.length)];

  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl">{title}</h1>
        <Quote content={randomQuote.text} origin={randomQuote.origin} />

        <Link className="btn btn-primary btn-lg" href={"/popular"}>
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default Custom404;
