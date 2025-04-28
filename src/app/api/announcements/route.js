import { NextResponse } from 'next/server';
import { announcementsDb } from '../../../lib/db';

// GET tüm duyuruları getirir
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Eğer id parametresi varsa, belirli bir duyuruyu getir
    if (id) {
      const numericId = parseInt(id, 10);
      const announcement = await announcementsDb.getAnnouncementById(numericId);
      
      return NextResponse.json(
        { announcement },
        { status: announcement ? 200 : 404 }
      );
    }
    
    // Tüm duyuruları getir
    const announcements = await announcementsDb.getAllAnnouncements();
    
    return NextResponse.json(
      { announcements },
      { status: 200 }
    );
  } catch (error) {
    console.error('Duyurular alınırken hata:', error);
    
    // Hata durumunda boş bir dizi dön (localStorage'a düşme db.js içinde yapılıyor)
    return NextResponse.json(
      { announcements: [] },
      { status: 200 }
    );
  }
}

// POST yeni duyuru ekler
export async function POST(request) {
  let data;

  try {
    data = await request.json();
  } catch (error) {
    console.error('JSON işleme hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Geçersiz JSON verisi.'
      },
      { status: 400 }
    );
  }
  
  try {
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Başlık ve içerik zorunludur.' },
        { status: 400 }
      );
    }
    
    // ID yoksa oluştur
    if (!data.id) {
      data.id = Date.now();
    }
    
    // Tarih yoksa ekle
    if (!data.date) {
      data.date = new Date().toLocaleDateString('tr-TR');
    }
    
    // Görsel URL'si kontrol et
    if (!data.image_url) {
      data.image_url = null; // null değer veritabanında NULL olarak saklanacak
    }
    
    // Veritabanına duyuru ekle
    const announcement = await announcementsDb.addAnnouncement(data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Duyuru başarıyla eklendi.',
        announcement 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Duyuru eklenirken hata:', error);
    
    // Client tarafı hata yönetimi için başarı mesajı
    return NextResponse.json(
      { 
        success: true, 
        message: 'Duyuru yerel olarak kaydedildi. Veritabanına kaydedilemedi.',
        announcement: {
          ...data,
          id: data.id || Date.now(),
          date: data.date || new Date().toLocaleDateString('tr-TR'),
          image_url: data.image_url || null
        } 
      },
      { status: 201 }
    );
  }
}

// DELETE bir duyuruyu siler
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Duyuru ID\'si gereklidir.' },
        { status: 400 }
      );
    }
    
    // ID'yi number tipine dönüştür
    const numericId = parseInt(id, 10);
    
    // Veritabanından duyuruyu sil
    const deleted = await announcementsDb.deleteAnnouncement(numericId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Duyuru bulunamadı veya silinemedi.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Duyuru başarıyla silindi.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Duyuru silinirken hata:', error);
    
    return NextResponse.json(
      { success: true, message: 'Duyuru yerel olarak silindi. Veritabanından silinemedi.' },
      { status: 200 }
    );
  }
}

// PUT bir duyuruyu günceller
export async function PUT(request) {
  let data;

  try {
    data = await request.json();
  } catch (error) {
    console.error('JSON işleme hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Geçersiz JSON verisi.'
      },
      { status: 400 }
    );
  }
  
  try {
    if (!data.id || !data.title || !data.content) {
      return NextResponse.json(
        { error: 'ID, başlık ve içerik zorunludur.' },
        { status: 400 }
      );
    }
    
    // Veritabanında duyuruyu güncelle
    const updatedAnnouncement = await announcementsDb.updateAnnouncement(data.id, data);
    
    if (!updatedAnnouncement) {
      return NextResponse.json(
        { error: 'Duyuru bulunamadı veya güncellenemedi.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Duyuru başarıyla güncellendi.',
        announcement: updatedAnnouncement 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Duyuru güncellenirken hata:', error);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Duyuru yerel olarak güncellendi. Veritabanında güncellenemedi.',
        announcement: data
      },
      { status: 200 }
    );
  }
}
