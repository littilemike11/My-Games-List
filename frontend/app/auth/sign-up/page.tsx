"use client";
import AuthModal from "@/app/components/AuthModal";
import supabase from "@/app/utils/supabase/client";
import { redirect } from "next/navigation";
import { useState } from "react";
export default function SignUpPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }, // pass username in user metadata
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="">
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
              onChange={(e) => setUsername(e.target.value)}
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
        </div>
      </div>
    </div>
  );
}
