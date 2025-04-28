import { NextResponse } from 'next/server';

// Bu API eski bir API ve artık announcements API'si tarafından değiştirilmiştir

// GET tüm kullanıcıları getirir
export async function GET() {
  try {
    const users = await executeQuery({ 
      query: 'SELECT * FROM users',
      values: []
    });
    
    return NextResponse.json({ users }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: 'Kullanıcılar alınamadı' }, { status: 500 });
  }
}

// POST yeni kullanıcı ekler
export async function POST() {
  try {
    return NextResponse.json(
      { message: 'Bu API artık kullanılmıyor. Lütfen /api/announcements API rotasını kullanın.' }, 
      { status: 301 }
    );
  } catch {
    return NextResponse.json({ success: false, message: 'Kullanıcı eklenemedi' }, { status: 500 });
  }
}

// DELETE kullanıcı siler (id URL parametresi olarak alınır)
export async function DELETE(request) {
  try {
    return NextResponse.json(
      { message: 'Bu API artık kullanılmıyor. Lütfen /api/announcements API rotasını kullanın.' }, 
      { status: 301 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'İşlem sırasında bir hata oluştu.' }, 
      { status: 500 }
    );
  }
} 