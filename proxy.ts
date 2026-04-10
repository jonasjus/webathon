// Next.js 16: middleware is now called "proxy" — file must be proxy.ts,
// and the default export must be named `proxy` (not `middleware`).
// See: node_modules/next/dist/docs/01-app/02-guides/authentication.md

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function proxy(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies onto both the request (so later server code sees them)
          // and the response (so the browser receives them)
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Calling getUser() refreshes the session token if it has expired.
  // The return value is intentionally unused here — we only care about
  // the side effect of the cookie being refreshed.
  await supabase.auth.getUser();

  return response;
}

// Run on all routes except static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
