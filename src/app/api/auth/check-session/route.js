import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Admin token'ı kontrol et
    const adminToken = cookies().get('admin_token')?.value;
    
    // Anti-cache başlıkları
    const headers = new Headers();
    headers.append('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');
    
    if (adminToken) {
      return NextResponse.json({ 
        authenticated: true,
        message: 'Geçerli oturum bulundu'
      }, { 
        headers,
        status: 200 
      });
    } else {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Oturum bulunamadı'
      }, { 
        headers,
        status: 200 
      });
    }
  } catch (error) {
    console.error('Oturum kontrolü hatası:', error);
    return NextResponse.json({ 
      authenticated: false,
      message: 'Oturum kontrol edilirken hata oluştu',
      error: error.message
    }, { status: 500 });
  }
} 