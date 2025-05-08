import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Sadece yönetici sayfaları için kontrol
  if (pathname.startsWith('/admin')) {
    // Giriş sayfasına erişim kontrolü atlanabilir
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Admin token kontrolü
    const adminToken = request.cookies.get('admin_token');
    
    // Token yoksa giriş sayfasına yönlendir
    if (!adminToken) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    
    // Token varsa devam et
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Middleware'in çalışacağı path'leri belirleyelim
export const config = {
  matcher: ['/admin/:path*']
}; 