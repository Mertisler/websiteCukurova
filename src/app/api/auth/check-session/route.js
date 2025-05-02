import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const adminToken = cookies().get('admin_token');
    
    if (adminToken) {
      return NextResponse.json({ 
        authenticated: true,
        message: 'Geçerli oturum bulundu'
      });
    } else {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Oturum bulunamadı'
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false,
      message: 'Oturum kontrol edilirken hata oluştu'
    }, { status: 500 });
  }
} 