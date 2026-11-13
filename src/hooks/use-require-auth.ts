"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

/**
 * Guards a client page behind the better-auth session.
 * While the session is loading the page should render a loading state;
 * once it resolves without a user, the visitor is redirected to /Sign-In.
 */
export const useRequireAuth = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/Sign-In");
    }
  }, [isPending, user, router]);

  return { session, user, isPending };
};
