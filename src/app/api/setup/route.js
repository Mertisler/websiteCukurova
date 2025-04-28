import { setupDatabase } from '../../../lib/db';
import { NextResponse } from 'next/server';

// GET isteği ile veritabanı tablolarını oluşturur
export async function GET() {
  try {
    const result = await setupDatabase();
    
    if (result) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Veritabanı tabloları başarıyla oluşturuldu' 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Veritabanı tabloları oluşturulurken bir hata oluştu',
          note: 'Ancak uygulama localStorage ile çalışmaya devam edecek'
        },
        { status: 200 } // İstemcide hatadan kaçınmak için 200 dönüyoruz
      );
    }
  } catch (error) {
    console.error('Veritabanı kurulum hatası:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Veritabanı tabloları oluşturulurken bir hata oluştu.',
        message: error.message,
        note: 'Uygulama localStorage ile çalışmaya devam edecek'
      },
      { status: 200 } // İstemcide hatadan kaçınmak için 200 dönüyoruz
    );
  }
} 