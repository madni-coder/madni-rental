import { NextResponse } from "next/server";

const AUTH_COOKIE = "razvi_token";

export function proxy(request) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        return NextResponse.redirect(new URL(token ? "/properties" : "/login", request.url));
    }

    if (pathname.startsWith("/properties") && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/login") && token) {
        return NextResponse.redirect(new URL("/properties", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/properties/:path*"],
};