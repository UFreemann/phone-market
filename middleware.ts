// import { auth } from '@/auth';
// import { NextResponse } from 'next/server';

// export default auth((req) => {
//   const isLoggedIn = !!req.auth;
//   const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
//   const userRole = req.auth?.user?.role;
//   const path = req.nextUrl.pathname;

//   // 1. If trying to access dashboard but not logged in -> KICK OUT
//   if (isOnDashboard && !isLoggedIn) {
//     return NextResponse.redirect(
//       new URL('/login?error=session_expired', req.nextUrl),
//     );
//   }

//   // 1. ADMIN ROUTE PROTECTION
//   // Only ADMIN can access /admin
//   if (path.startsWith('/admin') && path !== '/admin/login') {
//     if (!isLoggedIn) {
//       return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
//     }
//     if (userRole !== 'ADMIN') {
//       // Dealer trying to access admin? Send to dashboard
//       return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
//     }
//   }

//   // 2. DEALER ROUTE PROTECTION
//   // Only DEALER can access /dashboard
//   if (path.startsWith('/dashboard')) {
//     if (!isLoggedIn) {
//       return NextResponse.redirect(new URL('/login', req.nextUrl));
//     }
//     if (userRole === 'ADMIN') {
//       // Admin trying to access dealer dash? Allow it? Or send to admin?
//       // Usually Admins SHOULD be able to see Dealer Dash to manage official store.
//       return NextResponse.next();
//     }
//     if (userRole === 'VISITOR') {
//       return NextResponse.redirect(new URL('/profile', req.nextUrl));
//     }
//   }

//   return NextResponse.next();
// });

import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role; // "ADMIN" | "DEALER" | "VISITOR"
  const path = req.nextUrl.pathname;

  // --- 1. HANDLE UNAUTHENTICATED USERS ---
  // If not logged in, block protected routes completely
  if (!isLoggedIn) {
    if (path.startsWith('/admin') && path !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
    }
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    if (
      path.startsWith('/profile') ||
      path.startsWith('/saved') ||
      path.startsWith('/feed')
    ) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    // Allow access to public pages (/, /shop, /phone)
    return NextResponse.next();
  }

  // --- 2. HANDLE LOGGED IN USERS (Role Enforcement) ---

  // A. PROTECT ADMIN ROUTES
  if (path.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      // If a Dealer/Visitor tries to go to /admin, send them to their home base
      if (userRole === 'DEALER')
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  // B. PROTECT DEALER DASHBOARD
  if (path.startsWith('/dashboard')) {
    if (userRole === 'VISITOR') {
      // Visitors cannot sell. Redirect to buyer profile.
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    // Admin & Dealer allowed here.
  }

  // C. PROTECT AUTH PAGES (If already logged in, don't show login page)
  if (
    path === '/login' ||
    path === '/register' ||
    path === '/signup' ||
    path === '/admin/login'
  ) {
    if (userRole === 'ADMIN')
      return NextResponse.redirect(new URL('/admin', req.nextUrl));
    if (userRole === 'DEALER')
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    if (userRole === 'VISITOR')
      return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // This matcher ensures middleware runs on all paths except images/static files
  // Exclude API routes, static files, images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
