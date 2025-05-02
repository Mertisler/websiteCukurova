import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    console.log('Çıkış isteği alındı');
    
    // Cookie işlemlerinde await yok!
    cookies().delete('admin_token', {
      path: '/', // Cookie'nin tüm path'lerde silinmesini sağlar
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    });
    
    console.log('admin_token cookie silindi');
    
    // Cache kontrolü için başlıklar ekleyelim
    const headers = new Headers();
    headers.append('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');
    
    // Ana sayfaya yönlendirme yapılacak
    return NextResponse.json({ 
      success: true, 
      message: 'Çıkış başarılı',
      redirectUrl: '/' // Ana sayfaya yönlendirme için URL
    }, { 
      headers,
      status: 200
    });
  } catch (error) {
    console.error('Çıkış hatası:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Çıkış işlemi sırasında hata oluştu',
      error: error.message
    }, { status: 500 });
  }
} 