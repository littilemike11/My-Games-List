import Link from "next/link";
import Quote from "./components/Quote";
export default function Custom404() {
  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl">404 | Page Not Found</h1>
        <Quote type="error" />

        <Link className="btn btn-primary btn-lg" href={"/"}>
          Go Back Home
        </Link>
      </div>
    </>
  );
}
