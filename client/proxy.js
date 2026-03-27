import { NextResponse } from 'next/server';

export function proxy(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    if (!token && !isAuthPage) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (token && isAuthPage) {
        const dashboardUrl = new URL('/properties', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
