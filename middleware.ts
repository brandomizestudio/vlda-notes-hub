import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const path = request.nextUrl.pathname;

  // Allow static files, assets, styleguide and public images
  if (
    path.startsWith('/_next') ||
    path.startsWith('/img') ||
    path.startsWith('/api') ||
    path.startsWith('/styleguide') ||
    path.startsWith('/assets') ||
    path === '/favicon.ico' ||
    path === '/icon.svg'
  ) {
    return response;
  }

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
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
  }

  const isAuthRoute = path === '/login' || path === '/register';
  const isAdminRoute = path.startsWith('/admin');

  // If already logged in and visiting login/register -> redirect to /batch/entrance
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/batch/entrance', request.url));
  }

  // If not logged in and visiting protected route -> redirect to /login
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If admin route and user is not admin -> return 404 (rewrite to /404, undiscoverable)
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.rewrite(new URL('/_not-found', request.url));
  }

  // Root path redirect to /batch/entrance if logged in, else to /login
  if (path === '/') {
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
