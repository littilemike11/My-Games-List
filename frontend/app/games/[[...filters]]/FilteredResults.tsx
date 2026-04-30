import { useRouter } from "next/router";

export default function FilteredReults() {
  const router = useRouter();
  return <p>Post: {router.query.slug}</p>;
}
