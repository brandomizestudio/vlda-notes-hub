import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Immediately allow Next.js internals, static files, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/img') ||
    pathname.startsWith('/styleguide') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg'
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check for local development demo cookie
  const localUserCookie = request.cookies.get('vldd_local_user')?.value;
  let user: { id: string } | null = null;
  let userRole = 'student';

  if (localUserCookie) {
    try {
      const parsed = JSON.parse(localUserCookie);
      user = { id: 'mock-user-123' };
      userRole = parsed.role || 'student';
    } catch {}
  }

  // Check Supabase SSR session if available
  if (!user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              request.cookies.set({ name, value, ...options });
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              request.cookies.set({ name, value: '', ...options });
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set({ name, value: '', ...options });
            },
          },
        }
      );

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        user = session.user;
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        userRole = profile?.role || 'student';
      }
    } catch {}
  }

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isAdminRoute = pathname.startsWith('/admin');

  // If already logged in and visiting login/register -> redirect to /batch/entrance
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/batch/entrance', request.url));
  }

  // If not logged in and visiting protected route -> redirect to /login
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If admin route and user is not admin -> return 404
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.rewrite(new URL('/_not-found', request.url));
  }

  // Root path redirect
  if (pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/batch/entrance', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|img|favicon.ico|icon.svg|assets|styleguide|.*\\..*).*)',
  ],
};
