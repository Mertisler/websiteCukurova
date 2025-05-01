import { NextResponse } from 'next/server';
import { testDatabaseConnection, dbConfig } from '@/lib/db';

export async function GET() {
  try {
    // Veritabanı bağlantısını test et
    const isConnected = await testDatabaseConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Veritabanı bağlantısı başarılı',
        dbStatus: 'connected',
        dbConfig: {
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          user: dbConfig.user
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Veritabanı bağlantısı kurulamadı',
        dbStatus: 'disconnected',
        dbConfig: {
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          user: dbConfig.user
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('DB test endpoint hatası:', error);
    return NextResponse.json({
      success: false,
      message: `Bağlantı testi sırasında hata: ${error.message}`,
      dbStatus: 'error',
      error: error.message
    }, { status: 500 });
  }
} 