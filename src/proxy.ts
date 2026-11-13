import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const config = {
  matcher: ["/Add-Books", "/My-Books", "/My-Borrows", "/My-Profile", ],
};

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    const signInUrl = new URL("/Sign-In", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
