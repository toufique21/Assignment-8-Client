"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

const quickLinks = [
  {
    href: "/My-Books",
    label: "My Books",
    description: "Manage the books you have added to BookNook.",
  },
  {
    href: "/My-Borrows",
    label: "My Borrows",
    description: "See the books you are currently borrowing.",
  },
  {
    href: "/Add-Books",
    label: "Add a Book",
    description: "Share another book with the community.",
  },
];

const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm font-medium break-all text-foreground sm:text-right">{value}</dd>
    </div>
  );
};

const MyProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const toastId = toast.loading("Signing you out...");

    try {
      await authClient.signOut();
      toast.success("Signed out successfully.", { id: toastId });
      router.push("/Sign-In");
      router.refresh();
    } catch {
      toast.error("Could not sign you out. Please try again.", { id: toastId });
      setIsSigningOut(false);
    }
  };

  const displayName = user?.name?.trim() || "BookNook reader";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <section className="container mx-auto px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Your account
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Profile
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {user
              ? "The details you shared with BookNook when you created your account."
              : "Sign in to see the details of your BookNook account."}
          </p>
        </div>

        {isPending && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-sm text-muted-foreground shadow-sm">
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
            />
            Loading your profile...
          </div>
        )}

        {!isPending && !user && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">You are not signed in</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Sign in to see your profile and the information saved with your account.
            </p>
            <Link href="/Sign-In" className={`${primaryButtonClass} mt-6`}>
              Sign in
            </Link>
          </div>
        )}

        {user && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="relative h-24 bg-brand sm:h-28">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_60%)]"
                />
              </div>

              <div className="px-6 pb-6 sm:px-8">
                <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-card bg-muted shadow-sm sm:size-28">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={`Profile photo of ${displayName}`}
                        fill
                        sizes="7rem"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center bg-brand/10 text-3xl font-bold text-brand">
                        {initial}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className={secondaryButtonClass}
                  >
                    {isSigningOut ? (
                      <span
                        aria-hidden="true"
                        className="size-3.5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
                      />
                    ) : (
                      <FaSignOutAlt aria-hidden="true" className="size-3.5" />
                    )}
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {displayName}
                  </h2>
                  <p className="text-sm break-all text-muted-foreground">{user.email}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold ${
                        user.emailVerified
                          ? "bg-brand/10 text-brand"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.emailVerified ? "Email verified" : "Email not verified"}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[0.6875rem] font-semibold text-muted-foreground">
                      Member since {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
                <h2 className="text-lg font-semibold text-foreground">Account details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  These are the details saved with your BookNook account.
                </p>

                <dl className="mt-4 divide-y divide-border border-t border-border">
                  <DetailRow label="Full name" value={displayName} />
                  <DetailRow label="Email address" value={user.email} />
                  <DetailRow
                    label="Email status"
                    value={user.emailVerified ? "Verified" : "Not verified"}
                  />
                  <DetailRow
                    label="Profile photo"
                    value={user.image ? "Added from your sign-in provider" : "Initials only"}
                  />
                  <DetailRow label="Member since" value={formatDate(user.createdAt)} />
                  <DetailRow
                    label="Account ID"
                    value={<span className="font-mono text-xs">{user.id}</span>}
                  />
                </dl>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">Quick links</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Jump back into your shelf and reading list.
                </p>

                <ul className="mt-4 space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl border border-border px-4 py-3 transition hover:border-brand/40 hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <span className="block text-sm font-semibold text-foreground">
                          {link.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {link.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyProfilePage;
