"use client";

import { useState } from "react";
import supabase from "@/supabase-client";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      console.log(data);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        onClose(); // Close modal or redirect to onboarding
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        onClose();
      }
    }

    setLoading(false);
  };

  return (
    <>
      <dialog
        id="auth_modal"
        className={`modal modal-bottom sm:modal-middle ${
          isOpen ? "modal-open" : ""
        }`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {mode === "signup" ? "Sign Up" : "Log In"}
          </h3>

          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full mb-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            className="btn btn-primary w-full mb-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : mode === "signup" ? "Sign Up" : "Log In"}
          </button>

          <p className="text-center text-sm">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setMode("login")}
                  className="text-blue-500 cursor-pointer"
                >
                  Log In
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => setMode("signup")}
                  className="text-blue-500 cursor-pointer"
                >
                  Sign Up
                </span>
              </>
            )}
          </p>

          <div className="modal-action">
            <form method="dialog">
              <button onClick={onClose} className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
