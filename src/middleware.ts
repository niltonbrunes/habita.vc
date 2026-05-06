import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // 1. Handle legacy dashboard redirects
  if (pathname.startsWith('/dashboard')) {
    const newPathname = pathname.replace('/dashboard', '/crmhabita');
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  // 2. Reserved system keywords (not brokers)
  const reservedKeywords = [
    'crmhabita', 
    'imoveis', 
    'empreendimentos', 
    'login', 
    'register', 
    'api', 
    'dashboard',
    'blog',
    'corretor',
    'ofertashabita'
  ];

  // 3. Detect if it's a potential broker slug (root level, single segment)
  const segments = pathname.split('/').filter(Boolean);
  const isPotentialBrokerSlug = segments.length === 1 && !reservedKeywords.includes(segments[0]);

  // If it's a broker slug, we rewrite to the vitrine path internally
  if (isPotentialBrokerSlug) {
    const slug = segments[0];
    const url = request.nextUrl.clone();
    url.pathname = `/vitrine/${slug}`;
    return NextResponse.rewrite(url);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // 4. Auth protection for CRM routes
  if (pathname.startsWith('/crmhabita') && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
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
