import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Yönetici sayfaları için kontrol
  if (pathname.startsWith('/admin') || pathname.startsWith('/yonetim')) {
    // Anti-cache başlıkları
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    // Giriş sayfasına erişim kontrolü atlanabilir
    if (pathname === '/admin/login' || pathname === '/yonetim/giris') {
      return response;
    }

    // Admin token kontrolü
    const adminToken = request.cookies.get('admin_token')?.value;
    
    // Token yoksa giriş sayfasına yönlendir
    if (!adminToken) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    
    return response;
  }

  return NextResponse.next();
}

// Middleware'in çalışacağı path'leri belirleyelim
export const config = {
  matcher: ['/admin/:path*', '/yonetim/:path*']
}; 