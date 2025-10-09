import Search from "../components/Search";
export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=" pt-4 p-4 w-full">
        <Search />
        {children}
      </div>
    </>
  );
}
