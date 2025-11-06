"use client";
import { useAuth } from "../auth/auth-context";
import { useState } from "react";
import AuthModal from "./AuthModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
const CreateList = () => {
  const [showAuth, setShowAuth] = useState(false);
  const router = useRouter();
  const { session, profile, loading } = useAuth();

  const handleLink = () => {
    if (session) {
      router.push("/list/new");
    } else {
      setShowAuth(true);
    }
  };

  return (
    <>
      {/* <Link href={"/list/new"}> */}
      <button onClick={handleLink} className="btn btn-primary">
        {session ? "Start a new list here" : "Sign in to create a list"}
      </button>
      {/* </Link> */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default CreateList;
