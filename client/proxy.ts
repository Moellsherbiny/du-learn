import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.API_URL?.replace(/\/+$/, "");

if (!API_URL) {
  throw new Error("API_URL is not configured");
}

const PROTECTED_ROUTES = [
  "/learn",
];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const VERIFY_EMAIL_ROUTE = "/verify-email";

function matchesRoute(
  pathname: string,
  routes: string[],
) {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
}

async function getCurrentUser(
  request: NextRequest,
) {
  const accessToken =
    request.cookies.get("access_token")?.value;
  console.log(
  "ACCESS TOKEN:",
  Boolean(
    request.cookies.get("access_token")?.value,
  ),
);
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/auth/user/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Cookie: `access_token=${accessToken}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function proxy(
  request: NextRequest,
) {
  const { pathname, search } = request.nextUrl;

  const isProtectedRoute = matchesRoute(
    pathname,
    PROTECTED_ROUTES,
  );

  const isAuthRoute = matchesRoute(
    pathname,
    AUTH_ROUTES,
  );

  const isVerifyEmailRoute =
    pathname === VERIFY_EMAIL_ROUTE ||
    pathname.startsWith(
      `${VERIFY_EMAIL_ROUTE}/`,
    );

  /*
   * /verify-email
   *
   * الصفحة متاحة للمستخدم سواء كان:
   * - غير مسجل دخول
   * - مسجل دخول لكن البريد غير مؤكد
   *
   * لذلك لا نضع عليها أي redirect.
   */
  if (isVerifyEmailRoute) {
    return NextResponse.next();
  }

  /*

   * صفحات النظام المحمية
   *
   * المستخدم لازم:
   * 1. يكون مسجل دخول
   * 2. يكون البريد مؤكد
   */
if (isProtectedRoute) {
  const user = await getCurrentUser(request);

  console.log("PROXY USER:", user);

  if (!user) {
    console.log("PROXY REDIRECT: LOGIN");

    const loginUrl = new URL("/login", request.url);
    const next = `${pathname}${search}`;

    loginUrl.searchParams.set("next", next);

    return NextResponse.redirect(loginUrl);
  }

  console.log(
    "PROXY EMAIL VERIFIED:",
    user.email_verified,
  );

  if (!user.email_verified) {
    console.log("PROXY REDIRECT: VERIFY EMAIL");

    const verifyUrl = new URL(
      VERIFY_EMAIL_ROUTE,
      request.url,
    );

    verifyUrl.searchParams.set(
      "email",
      user.email,
    );

    return NextResponse.redirect(verifyUrl);
  }

  return NextResponse.next();
}
  /*
   * صفحات الـ Auth
   *
   * لو المستخدم غير مسجل:
   * يسمح له بالدخول.
   */
  if (isAuthRoute) {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.next();
    }

    /*
     * مسجل دخول لكن البريد غير مؤكد
     */
    if (!user.email_verified) {
      const verifyUrl = new URL(
        VERIFY_EMAIL_ROUTE,
        request.url,
      );

      verifyUrl.searchParams.set(
        "email",
        user.email,
      );

      return NextResponse.redirect(
        verifyUrl,
      );
    }

    /*
     * مسجل دخول ومؤكد بالفعل
     */
    const next =
      request.nextUrl.searchParams.get(
        "next",
      );

    if (
      next &&
      next.startsWith("/") &&
      !next.startsWith("//")
    ) {
      return NextResponse.redirect(
        new URL(next, request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/learn", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/learn/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password/:path*",
    "/verify-email/:path*",
  ],
};