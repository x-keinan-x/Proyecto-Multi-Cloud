import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (!token && pathname.startsWith('/catalog')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    // Redirigir al catálogo para evitar doble login
    return NextResponse.redirect(new URL('/catalog', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/catalog/:path*',
    '/login',
    '/register'
  ],
};