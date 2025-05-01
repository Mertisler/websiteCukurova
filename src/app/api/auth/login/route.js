import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Sabit kullanıcı adı ve şifre (gerçek uygulamada bu bilgileri güvenli bir şekilde saklamalısınız)
const ADMIN_USER = "çukurovaömer";
const ADMIN_PASSWORD = "Ömer.141418";

// Güvenlik için bir token oluşturma fonksiyonu
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { username, password } = data;

    console.log('Giriş denemesi:', { username }); // Şifreyi loglamıyoruz güvenlik için

    // Kullanıcı adı ve şifre kontrolü
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      // Başarılı giriş durumunda bir token oluştur
      const token = generateToken();
      console.log('Giriş başarılı, token oluşturuldu');
      
      // Önce eski cookie'yi sil (eğer varsa)
      cookies().delete('admin_token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      
      // Yeni cookie'yi ayarla - 24 saat geçerli olsun
      cookies().set('admin_token', token, {
        expires: Date.now() + 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      });

      // Önbellek kontrolü için headers
      const headers = new Headers();
      headers.append('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      headers.append('Pragma', 'no-cache');
      headers.append('Expires', '0');

      return NextResponse.json({ 
        success: true, 
        message: 'Giriş başarılı',
        role: 'admin'
      }, {
        headers,
        status: 200 
      });
    }

    console.log('Giriş başarısız: Geçersiz kullanıcı adı veya şifre');
    
    // Yanlış kullanıcı adı veya şifre
    return NextResponse.json({ 
      success: false, 
      message: 'Geçersiz kullanıcı adı veya şifre'
    }, { status: 401 });
  } catch (error) {
    console.error('Login hatası:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Giriş işlemi sırasında hata oluştu',
      error: error.message
    }, { status: 500 });
  }
} 