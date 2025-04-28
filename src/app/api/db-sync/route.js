import { NextResponse } from 'next/server';
import { initializePool, setupDatabase, announcementsDb, executeQuery } from '../../../lib/db';

// Veritabanı bağlantısını test et
export async function GET() {
  try {
    // Veritabanı bağlantısını oluştur
    const pool = initializePool();
    
    if (!pool) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Uzak veritabanı bağlantısı başarısız oldu. Lütfen bağlantı bilgilerini kontrol edin.',
          dbStatus: 'disconnected'
        },
        { status: 500 }
      );
    }
    
    // Gerçek bir sorgu ile bağlantıyı test et
    try {
      await executeQuery({ query: 'SELECT 1 AS connection_test' });
    } catch (testError) {
      console.error('Uzak veritabanı bağlantı testi başarısız:', testError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Uzak veritabanına erişim sağlanamadı: ' + testError.message,
          dbStatus: 'error' 
        },
        { status: 500 }
      );
    }
    
    // Announcements tablosunu kontrol et
    try {
      await executeQuery({ query: 'DESCRIBE announcements' });
      console.log('Announcements tablosu kontrol edildi, tablo mevcut');
    } catch (tableError) {
      console.error('Tablo kontrol edilirken hata:', tableError);
      
      // Tablo yoksa kurulum API'sini çağır
      try {
        await setupDatabase();
      } catch (setupError) {
        console.error('Veritabanı tabloları oluşturulurken hata:', setupError);
        return NextResponse.json(
          { 
            success: false, 
            message: 'Announcements tablosu bulunamadı ve oluşturulamadı: ' + setupError.message,
            dbStatus: 'error' 
          },
          { status: 500 }
        );
      }
    }
    
    // Bağlantı ve tablo kontrolü başarılı
    return NextResponse.json(
      { 
        success: true, 
        message: 'Uzak veritabanı bağlantısı başarılı ve tablolar hazır.',
        dbStatus: 'connected'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Veritabanı senkronizasyon hatası:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Uzak veritabanı bağlantısı sırasında bir hata oluştu: ' + error.message,
        dbStatus: 'error'
      },
      { status: 500 }
    );
  }
}

// Yerel duyuruları sunucuya senkronize et
export async function POST(request) {
  try {
    // Veritabanı bağlantısını kontrol et
    const pool = initializePool();
    
    if (!pool) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Uzak veritabanı bağlantısı kurulamadığı için senkronizasyon yapılamıyor.',
          dbStatus: 'disconnected'
        },
        { status: 500 }
      );
    }
    
    let data;
    try {
      data = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz JSON verisi.' 
        },
        { status: 400 }
      );
    }
    
    // Yerel duyurular dizisini al
    const localAnnouncements = data.announcements || [];
    
    if (localAnnouncements.length === 0) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Senkronize edilecek yerel duyuru yok.',
          syncedCount: 0
        },
        { status: 200 }
      );
    }
    
    // Önce mevcut tüm veritabanı duyurularını al
    let dbAnnouncements = [];
    try {
      dbAnnouncements = await announcementsDb.getAllAnnouncements();
    } catch (error) {
      console.error('Uzak veritabanındaki duyurular alınamadı:', error);
      // Hataya rağmen devam et, mevcut duyuruları kontrol etmeden ekleyeceğiz
    }
    
    // Veritabanında olan duyuru ID'lerini topla
    const existingIds = new Set(dbAnnouncements.map(a => a.id));
    
    // Olmayan duyuruları topla
    const announcementsToSync = localAnnouncements.filter(a => !existingIds.has(a.id));
    
    console.log(`Uzak veritabanına eklenecek ${announcementsToSync.length} duyuru bulundu.`);
    
    let syncedCount = 0;
    const errors = [];
    
    // Her bir duyuruyu senkronize et
    for (const announcement of announcementsToSync) {
      try {
        // Duyuruyu eklemeden önce, gerekli tüm alanların olduğundan emin ol
        const completeAnnouncement = {
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          date: announcement.date || new Date().toLocaleDateString('tr-TR'),
          image_url: announcement.image_url || null
        };
        
        await announcementsDb.addAnnouncement(completeAnnouncement);
        syncedCount++;
        console.log(`Duyuru başarıyla senkronize edildi (ID: ${announcement.id})`);
      } catch (error) {
        console.error(`Duyuru senkronize edilirken hata (ID: ${announcement.id}):`, error);
        errors.push({
          id: announcement.id,
          error: error.message
        });
      }
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: `${syncedCount} duyuru başarıyla uzak veritabanına senkronize edildi.`,
        syncedCount,
        errors: errors.length > 0 ? errors : undefined
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Duyuru senkronizasyon hatası:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Duyurular uzak veritabanına senkronize edilirken bir hata oluştu: ' + error.message
      },
      { status: 500 }
    );
  }
} 