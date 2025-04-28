import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { dbConfig } from '../../../lib/db';

// Veritabanı tablosunu güncellemek için API endpoint
export async function GET() {
  let connection;
  
  try {
    console.log('Veritabanı tablo güncelleme başlatılıyor...');
    console.log('Bağlantı bilgileri:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    // Veritabanına bağlan
    try {
      console.log('MySQL sunucusuna bağlanılıyor...');
      connection = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        connectTimeout: 60000
      });
      console.log('MySQL sunucusuna başarıyla bağlandı');
    } catch (connectionError) {
      console.error('MySQL sunucusuna bağlanırken hata:', connectionError);
      return NextResponse.json({
        success: false,
        message: 'MySQL sunucusuna bağlanırken hata: ' + connectionError.message,
        error: {
          code: connectionError.code,
          errno: connectionError.errno,
          sqlMessage: connectionError.sqlMessage,
          sqlState: connectionError.sqlState
        }
      }, { status: 500 });
    }
    
    // Mevcut tablo yapısını kontrol et
    try {
      console.log('Tablo yapısı kontrol ediliyor...');
      const [columns] = await connection.query(`SHOW COLUMNS FROM announcements`);
      
      // image_url sütunu var mı kontrol et
      const hasImageUrlColumn = columns.some(col => col.Field === 'image_url');
      
      if (!hasImageUrlColumn) {
        // image_url sütunu ekle
        console.log('image_url sütunu tabloya ekleniyor...');
        await connection.query(`
          ALTER TABLE announcements
          ADD COLUMN image_url VARCHAR(255) DEFAULT NULL AFTER date
        `);
        console.log('image_url sütunu başarıyla eklendi');
        
        return NextResponse.json({
          success: true,
          message: 'Tablo başarıyla güncellendi, image_url sütunu eklendi.',
          tableStructure: columns
        }, { status: 200 });
      } else {
        console.log('image_url sütunu zaten mevcut, güncelleme gerekmiyor');
        
        return NextResponse.json({
          success: true,
          message: 'image_url sütunu zaten mevcut, güncelleme yapılmadı.',
          tableStructure: columns
        }, { status: 200 });
      }
    } catch (error) {
      console.error('Tablo güncellenirken hata:', error);
      
      return NextResponse.json({
        success: false,
        message: 'Tablo güncellenirken hata: ' + error.message,
        error: {
          code: error.code,
          errno: error.errno,
          sqlMessage: error.sqlMessage,
          sqlState: error.sqlState
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Veritabanı tablo güncelleme hatası:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Veritabanı tablo güncelleme sırasında bir hata oluştu: ' + error.message,
      error: {
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage,
        sqlState: error.sqlState
      }
    }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Veritabanı bağlantısı kapatıldı');
      } catch (err) {
        console.error('Bağlantı kapatılırken hata:', err);
      }
    }
  }
} 