import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { dbConfig } from '../../../lib/db';

// Veritabanını ve tabloları oluşturmak için API endpoint
export async function GET() {
  let connection;
  
  try {
    console.log('Uzak veritabanı bağlantısı başlatılıyor...');
    console.log('Bağlantı bilgileri:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    // Doğrudan veritabanına bağlan (veritabanı var olduğu için)
    try {
      console.log('Uzak MySQL sunucusuna bağlanılıyor...');
      connection = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database, // Doğrudan veritabanını belirt
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
    
    // MySQL versiyonunu ve veritabanı bilgilerini al
    const [versionRows] = await connection.query('SELECT VERSION() as version');
    const mysqlVersion = versionRows[0].version;
    
    // Veritabanındaki tabloları listele
    const [tablesResult] = await connection.query('SHOW TABLES');
    const tables = tablesResult.map(row => Object.values(row)[0]);
    
    // Announcements tablosunu kontrol et
    const hasAnnouncementsTable = tables.includes('announcements');
    
    // Announcements tablosunu oluştur (yoksa)
    if (!hasAnnouncementsTable) {
      try {
        console.log('Announcements tablosu oluşturuluyor...');
        await connection.query(`
          CREATE TABLE IF NOT EXISTS announcements (
            id BIGINT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            date VARCHAR(50) NOT NULL,
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('Announcements tablosu başarıyla oluşturuldu');
      } catch (tableCreateError) {
        console.error('Tablo oluşturulurken hata:', tableCreateError);
        return NextResponse.json({
          success: false,
          message: 'Tablo oluşturulurken hata: ' + tableCreateError.message,
          error: tableCreateError
        }, { status: 500 });
      }
    } else {
      console.log('Announcements tablosu zaten mevcut, oluşturulmadı');
    }
    
    // Kurulum bilgilerini döndür
    return NextResponse.json({
      success: true,
      message: 'Uzak veritabanı bağlantısı ve tablo kontrolü başarıyla tamamlandı.',
      details: {
        connected: true,
        tableCreated: !hasAnnouncementsTable,
        tableExists: hasAnnouncementsTable,
        mysqlVersion: mysqlVersion,
        allTables: tables,
        connectionInfo: {
          host: dbConfig.host,
          user: dbConfig.user,
          database: dbConfig.database
        }
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Veritabanı kurulumu sırasında hata:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Veritabanı kurulumu sırasında bir hata oluştu: ' + error.message,
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