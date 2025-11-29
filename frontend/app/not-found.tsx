import Link from "next/link";
import Quote from "./components/Quote";
import { errorQuotes } from "./mockData/quotes";
export default function Custom404() {
  let randomQuote = errorQuotes[Math.floor(Math.random() * errorQuotes.length)];

  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl">404 | Page Not Found</h1>
        <Quote content={randomQuote.text} origin={randomQuote.origin} />

        <Link className="btn btn-primary btn-lg" href={"/popular"}>
          Go Back Home
        </Link>
      </div>
    </>
  );
}
