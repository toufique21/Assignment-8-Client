"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating your account...");

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message || "Could not create your account. Please try again.");
      }

      toast.success("Account created successfully!", { id: toastId });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create your account. Please try again.",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || `Could not sign in with ${provider}.`);
    }
  };

  return (
    <section className="container mx-auto px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Join BookNook
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to add books to the shelves and keep track of your borrows.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                required
                maxLength={80}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-brand-foreground/40 border-t-brand-foreground"
              />
            )}
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[0.625rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              or continue with
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              <FaGoogle className="size-3.5" aria-hidden="true" />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              <FaGithub className="size-3.5" aria-hidden="true" />
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/Sign-In" className="font-semibold text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
