"use client";
import { useState } from "react";
import supabase from "@/app/utils/supabase/client";
import { redirect } from "next/navigation";
import { checkUsername } from "../api/supabase-api/profile-api";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only letters, numbers, underscore, dash — and max 12 chars
    const cleaned = value
      .replace(/[^a-zA-Z0-9_-]/g, "") // remove disallowed chars
      .slice(0, 16); // enforce max length

    setUsername(cleaned);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const validUserName = username.toLocaleLowerCase();

    if (mode === "signup") {
      if (confirmPassword !== password) {
        setError("passwords must match");
        setLoading(false);

        return;
      }
      const usernameExists = await checkUsername(validUserName);
      if (usernameExists) {
        setError("Username is taken");
        setLoading(false);

        return;
      }
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: validUserName }, // pass username in user metadata
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      redirect("/welcome");

      // No need to manually insert into profiles or call createDefaultLists()
      // The trigger handles both automatically
      //   onClose(); // Close modal or redirect to onboarding
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        // onClose();
      }
    }
    setLoading(false);
    // ideally redirect to the page you tried to go to previously
    redirect("/");
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
              required
              type="text"
              placeholder="Username"
              className="input input-bordered w-full mb-2"
              value={username}
              onChange={handleUsernameChange}
            />
          )}

          <input
            required
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            required
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode == "signup" && (
            <input
              required
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full mb-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
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
