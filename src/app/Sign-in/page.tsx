"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Signing you in...");

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message || "Invalid email or password.");
      }

      toast.success("Signed in successfully!", { id: toastId });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign you in. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sign in to BookNook
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to add books, track your borrows and manage your collection.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-5">
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
                placeholder="Enter your password"
                autoComplete="current-password"
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
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/Sign-Up" className="font-semibold text-foreground hover:underline">
              Create one
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

export default SignInPage;
