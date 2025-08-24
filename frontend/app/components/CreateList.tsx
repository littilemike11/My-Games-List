"use client";
import { useAuth } from "../auth/auth-context";
import Link from "next/link";
const CreateList = () => {
  const { session, profile, loading } = useAuth();

  return (
    <>
      <Link href={"/list/new"}>
        <button className="btn btn-primary">
          {session ? "Start a new list here" : "Sign in to create a list"}
        </button>
      </Link>
    </>
  );
};

export default CreateList;
