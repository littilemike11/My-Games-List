"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/utils/supabase/client";
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

  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Use the native dialog API for modal behavior and focus management.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      emailRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const clear = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 16);

    setUsername(cleaned);
    setError(null);
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const validUsername = username.toLowerCase();

      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const usernameExists = await checkUsername(validUsername);

        if (usernameExists) {
          setError("That username is already taken. Please choose another.");
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: validUsername },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        clear();
        onClose();
        router.push("/welcome");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      clear();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setError(null);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
      className="modal modal-bottom sm:modal-middle"
      onCancel={(event) => {
        // Keep the dialog open while a request is in progress.
        if (loading) {
          event.preventDefault();
          return;
        }

        onClose();
      }}
      onClick={(event) => {
        // Close when the user clicks the backdrop, not the dialog content.
        if (event.target === dialogRef.current) {
          handleClose();
        }
      }}
    >
      <div className="modal-box">
        <h2 id="auth-modal-title" className="mb-2 text-lg font-bold">
          {mode === "signup" ? "Create your account" : "Log in"}
        </h2>

        <p id="auth-modal-description" className="mb-4 text-sm">
          {mode === "signup"
            ? "Create an account to join The Save Room community."
            : "Log in to continue to The Save Room."}
        </p>

        <form onSubmit={handleSubmit} aria-busy={loading}>
          {mode === "signup" && (
            <div className="mb-3">
              <label
                htmlFor="auth-username"
                className="mb-1 block text-sm font-medium"
              >
                Username
              </label>
              <input
                ref={undefined}
                id="auth-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                maxLength={16}
                pattern="[a-zA-Z0-9_-]+"
                title="Use only letters, numbers, underscores, and hyphens."
                placeholder="Choose a username"
                className="input input-bordered w-full"
                value={username}
                onChange={handleUsernameChange}
                disabled={loading}
                aria-describedby="auth-username-help"
              />
              <p id="auth-username-help" className="mt-1 text-xs opacity-70">
                Up to 16 characters: letters, numbers, underscores, or hyphens.
              </p>
            </div>
          )}

          <div className="mb-3">
            <label
              htmlFor="auth-email"
              className="mb-1 block text-sm font-medium"
            >
              Email address
            </label>
            <input
              ref={emailRef}
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="auth-password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              required
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              disabled={loading}
            />
          </div>

          {mode === "signup" && (
            <div className="mb-3">
              <label
                htmlFor="auth-confirm-password"
                className="mb-1 block text-sm font-medium"
              >
                Confirm password
              </label>
              <input
                id="auth-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Re-enter your password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                aria-invalid={
                  confirmPassword.length > 0 && confirmPassword !== password
                }
                aria-describedby="auth-confirm-password-help"
              />
              <p
                id="auth-confirm-password-help"
                className="mt-1 text-xs opacity-70"
              >
                Enter the same password again.
              </p>
            </div>
          )}

          {error && (
            <p role="alert" className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary mb-2 w-full"
            disabled={loading}
          >
            {loading
              ? mode === "signup"
                ? "Creating account…"
                : "Logging in…"
              : mode === "signup"
                ? "Sign up"
                : "Log in"}
          </button>

          <p className="text-center text-sm">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link link-primary"
                  onClick={() => switchMode("login")}
                  disabled={loading}
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="link link-primary"
                  onClick={() => switchMode("signup")}
                  disabled={loading}
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </form>

        <div className="modal-action">
          <button
            type="button"
            onClick={handleClose}
            className="btn"
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
