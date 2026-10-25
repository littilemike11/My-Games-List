import Link from "next/link";
import Quote from "@/app/components/Quote";
const Custom404: React.FC<{ title?: string }> = ({
  title = "404 | Page Not Found",
}) => {
  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl">{title}</h1>
        <Quote type="error" />

        <Link className="btn btn-primary btn-lg" href={"/"}>
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default Custom404;
